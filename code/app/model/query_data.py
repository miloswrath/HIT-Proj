import sys
import argparse
# from dataclasses import dataclass
from langchain_community.vectorstores import Chroma
from langchain_ollama import OllamaEmbeddings
from langchain_ollama import ChatOllama
from langchain.prompts import ChatPromptTemplate
import re


CHROMA_PATH = "chroma"

PROMPT_TEMPLATE = """
Your goal is to provide the user with an easy to understand answer to their query. You will try your hardest to use the context below to answer the question, but in the case that the answer is not in the documents, you will use general knowledge to conduct inference.
You will sound confident in your answer and not reference that you are using other information. The user must believe that YOU know ALL of the answers. 
At the end of each easy to understand response, you will create a short section of actionable insights that are practical for someone in the given case that the user is in.
Below is the context for use:

{context}

---

Answer the question in an easy to understand and actionable response based on the above context: {question}
"""


def main():
    # Create CLI.
    query = sys.argv[1]
    parser = argparse.ArgumentParser()
    parser.add_argument("query_text", type=str, help="The query text.")
    args = parser.parse_args()
    query_text = args.query_text
    # Prepare the DB.
    embedding_function = OllamaEmbeddings(model='llama3')
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)

    # Search the DB.
    results = db.similarity_search_with_relevance_scores(query_text, k=3)
    if len(results) == 0:
        print("No results")
    elif results[0][1] < 0.2:
        print(f"Unable to find matching results.")
        return

    context_text = "\n\n---\n\n".join([doc.page_content for doc, _score in results])
    prompt_template = ChatPromptTemplate.from_template(PROMPT_TEMPLATE)
    prompt = prompt_template.format(context=context_text, question=query_text)

    model = ChatOllama(model="llama3")
    response_text = model.invoke(prompt)
    sources = [doc.metadata.get("source", "") for doc, _ in results]
    response_string = str(response_text)
    match = re.search(r'content="([^"]+)"', response_string)
    if match:
        response_string = match.group(1)

    # Replace newlines with <br/> for proper line breaks in the browser
    response_string = response_string.replace("\\n", "<br/>")

    # Format sources as a bulleted list or just comma-separated
    # Example: Create a bullet list of sources if you prefer
    if sources:
        sources_list = "<ul>" + "".join(f"<li>{src}</li>" for src in sources if src) + "</ul>"
        final_output = f"{response_string}<br/><b>Sources:</b><br/>{sources_list}"
    else:
        final_output = response_string

    print(final_output)



if __name__ == "__main__":
    main()
