# from langchain.document_loaders import DirectoryLoader
from langchain_community.document_loaders import DirectoryLoader, UnstructuredFileLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_ollama import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.vectorstores.utils import filter_complex_metadata
from langchain_community.document_loaders import PyPDFLoader
from dotenv import load_dotenv
import os
import shutil
import glob
# Load environment variables. Assumes that project contains .env file with API keys
load_dotenv()
#---- Set OpenAI API key
# Change environment variable name from "OPENAI_API_KEY" to the name given in
# your .env file.
#openai.api_key = os.environ['OPENAI_API_KEY']

CHROMA_PATH = "chroma"
DATA_PATH = "data/books"


def main():
    generate_data_store()


def generate_data_store():
    directory_loader = CustomDirectoryLoader(directory_path="data", glob_pattern="**/*.pdf", mode="elements")
    documents = directory_loader.load()
    documents = filter_complex_metadata(documents)
    chunks = split_text(documents)
    save_to_chroma(chunks)

from typing import List

class CustomDirectoryLoader:
    def __init__(self, directory_path: str, glob_pattern: str = "*.*", mode: str = "single"):
        """
        Initialize the loader with a directory path and a glob pattern.
        :param directory_path: Path to the directory containing files to load.
        :param glob_pattern: Glob pattern to match files within the directory.
        :param mode: Mode to use with UnstructuredFileLoader ('single', 'elements', or 'paged').
        """
        self.directory_path = directory_path
        self.glob_pattern = glob_pattern
        self.mode = mode

    def load(self) -> List[Document]:
        """
        Load all files matching the glob pattern in the directory using UnstructuredFileLoader.
        :return: List of Document objects loaded from the files.
        """
        documents = []
        # Construct the full glob pattern
        full_glob_pattern = f"{self.directory_path}/{self.glob_pattern}"
        # Iterate over all files matched by the glob pattern
        for file_path in glob.glob(full_glob_pattern):
            # Use UnstructuredFileLoader to load each file
            loader = UnstructuredFileLoader(file_path=file_path, mode=self.mode)
            docs = loader.load()
            documents.extend(docs)
        return documents

def split_text(documents: list[Document]):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=300,
        chunk_overlap=100,
        length_function=len,
        add_start_index=True,
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    document = chunks[10]
    print(document.page_content)
    print(document.metadata)

    return chunks


def save_to_chroma(chunks: list[Document]):

    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    db = Chroma.from_documents(
        chunks, OllamaEmbeddings(model="llama3"), persist_directory=CHROMA_PATH
    )
    db.persist()
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")


if __name__ == "__main__":
    main()
