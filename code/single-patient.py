
import pandas as pd
import numpy as np
import json
import os
import matplotlib.pyplot as plt
import seaborn as sb
from tqdm import tqdm



file_path_list = []
for dirname, _, filenames in os.walk('../data/fhir'):
    for filename in filenames:
        file_path_list.append((dirname, filename))


metadata_df = pd.DataFrame(file_path_list, columns=["folder", "file"])
print(f"Files: {metadata_df.shape[0]}")


metadata_df.head()


def extract_subgroup(path):
    return path.split("/")[-1]

def extract_group(path):
    return path.split("/")[-2]


metadata_df["group"] = metadata_df["folder"].apply(lambda x: extract_group(x))
metadata_df["subgroup"] = metadata_df["folder"].apply(lambda x: extract_subgroup(x))
metadata_df = metadata_df[["folder", "group", "subgroup", "file"]]
metadata_df.head()


print(f"Folders: {metadata_df.folder.nunique()}")
print(f"Groups: {metadata_df.group.nunique()}")
print(f"Subgroups: {metadata_df.subgroup.nunique()}")
print(f"Files: {metadata_df.file.nunique()}")


sample_df= pd.read_json('../data/fhir/d8/d8c/d8cddeba-4cf8-412a-86de-b9af0a6a185b.json')
sample_df.head()


patient_df = pd.DataFrame() 
careplan_df = pd.DataFrame() 
condition_df = pd.DataFrame() 
diagnostic_report_df = pd.DataFrame() 
encounter_df = pd.DataFrame() 
immunization_df = pd.DataFrame() 
observation_df = pd.DataFrame() 
procedure_df = pd.DataFrame() 


def process_one_file(sample_df,
                    patient_df,
                    careplan_df,
                    condition_df,
                    diagnostic_report_df,
                    encounter_df,
                    immunization_df,
                    observation_df,
                    procedure_df):
    
    dataframe_list = [patient_df, careplan_df, condition_df, diagnostic_report_df,
                 encounter_df, immunization_df, observation_df, procedure_df]
    
    for index, row in sample_df.iterrows():
        resourcetype=set()
        tempdf=pd.json_normalize(row.entry)
        resourcetype.add([str(x) for x in tempdf['resource.resourceType']][0])

        if str(tempdf['resource.resourceType'][0])=="Patient":
            frames = [patient_df, tempdf]
            patient_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="CarePlan":
            frames = [careplan_df, tempdf]
            careplan_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="Condition":
            frames = [condition_df, tempdf]
            condition_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="DiagnosticReport":
            frames = [diagnostic_report_df, tempdf]
            diagnostic_report_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="Encounter":
            frames = [encounter_df, tempdf]
            encounter_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="Immunization":
            frames = [immunization_df, tempdf]
            immunization_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="Observation":
            frames = [observation_df, tempdf]
            observation_df = pd.concat(frames)

        elif str(tempdf['resource.resourceType'][0])=="Procedure":
            frames = [procedure_df, tempdf]
            procedure_df = pd.concat(frames)   

    return patient_df,\
                    careplan_df,\
                    condition_df,\
                    diagnostic_report_df,\
                    encounter_df,\
                    immunization_df,\
                    observation_df,\
                    procedure_df


def clean_and_rename(patient_df,
                    careplan_df,
                    condition_df,
                    diagnostic_report_df,
                    encounter_df,
                    immunization_df,
                    observation_df,
                    procedure_df):
    for df in [patient_df, careplan_df, condition_df, diagnostic_report_df,
                 encounter_df, immunization_df, observation_df, procedure_df]:
        df.columns = df.columns.str.replace(".", "_")
        df.columns = df.columns.str.replace("resource_", "")
    
    for df in [patient_df, observation_df, encounter_df]:
        df['fullUrl']= df['fullUrl'].str.replace('urn:uuid:', '')
        
    for df in [careplan_df, condition_df, diagnostic_report_df]:
        df['subject_reference']=df['subject_reference'].str.replace('urn:uuid:', '')
        df['context_reference']=df['context_reference'].str.replace('urn:uuid:', '')
    
    for df in [encounter_df, immunization_df]:
        df['patient_reference'] = df['patient_reference'].str.replace('urn:uuid:', '')
        
    for df in [immunization_df]:
        df['encounter_reference'] = df['encounter_reference'].str.replace('urn:uuid:', '')
        
    for df in [observation_df, procedure_df]:
        df['subject_reference'] = df['subject_reference'].str.replace('urn:uuid:', '')
        df['encounter_reference'] = df['encounter_reference'].str.replace('urn:uuid:', '')
        
    return patient_df,\
                    careplan_df,\
                    condition_df,\
                    diagnostic_report_df,\
                    encounter_df,\
                    immunization_df,\
                    observation_df,\
                    procedure_df



patient_df,\
careplan_df,\
condition_df,\
diagnostic_report_df,\
encounter_df,\
immunization_df,\
observation_df,\
procedure_df = \
process_one_file(sample_df,patient_df,
careplan_df,
condition_df,
diagnostic_report_df,
encounter_df,
immunization_df,
observation_df,
procedure_df)


patient_df.head()


sel_index = list(metadata_df.group.value_counts()[0:2].index)
sel_index


group_df = metadata_df.loc[metadata_df.group.isin(sel_index)]


group_df.shape[0], group_df.shape[0] / metadata_df.shape[0]

# ## Select 1.1k entries, or less than 1% of data


patient_df = pd.DataFrame() 
careplan_df = pd.DataFrame() 
condition_df = pd.DataFrame() 
diagnostic_report_df = pd.DataFrame() 
encounter_df = pd.DataFrame() 
immunization_df = pd.DataFrame() 
observation_df = pd.DataFrame() 
procedure_df = pd.DataFrame() 


for index, row in tqdm(group_df.iterrows()):
    folder = row["folder"]
    file = row["file"]
    sample_df = pd.read_json(os.path.join(folder, file))
    patient_df,\
    careplan_df,\
    condition_df,\
    diagnostic_report_df,\
    encounter_df,\
    immunization_df,\
    observation_df,\
    procedure_df = \
    process_one_file(sample_df,patient_df,
    careplan_df,
    condition_df,
    diagnostic_report_df,
    encounter_df,
    immunization_df,
    observation_df,
    procedure_df)

# ## WOW... that's hot...
# 
# ### Let's check the size for each


patient_df.shape[0], careplan_df.shape[0], condition_df.shape[0], diagnostic_report_df.shape[0], encounter_df.shape[0], immunization_df.shape[0],\
observation_df.shape[0], procedure_df.shape[0]


for df in [patient_df, careplan_df, condition_df, diagnostic_report_df, encounter_df, immunization_df, observation_df,procedure_df]:
    print(df.columns)


patient_df.head()


def plot_count(feature, title, df, size=1, ordered=True):
    sb.set_theme(style="whitegrid")
    f, ax = plt.subplots(1,1, figsize=(4*size,4))
    total = float(len(df))
    if ordered:
        g = sb.countplot(x=feature, data=df, order = df[feature].value_counts().index[:20], palette="Set3")
    else:
        g = sb.countplot(x=feature, data = df, palette='Set3')
    g.set_title("Number and percentage of {}".format(title))
    if(size > 2):
        plt.xticks(rotation=90, size=8)
    for p in ax.patches:
        height = p.get_height()
        ax.text(p.get_x()+p.get_width()/2.,
                height + 3,
                '{:1.2f}%'.format(100*height/total),
                ha="center") 
    plt.show()    


#plot gender count 



from datetime import datetime as dt
patient_df["birth_date"] = patient_df["resource.birthDate"].apply(lambda x: dt.strptime(x, '%Y-%m-%d'))
patient_df["birth_year"] = patient_df["birth_date"].apply(lambda x: x.year)
agg_year = patient_df.groupby(["birth_year"])["resource.gender"].count().reset_index()
agg_year.columns = ["birth_year", "count"]



def extract_subitems_by_name(item_list, name):
    for item in item_list:
        if item[name]:
            return item[name]
            
def extract_one_subitem_by_name(item_list, name):
    return item_list[0][name]

observation_df["date"] = observation_df["resource.effectiveDateTime"].apply(lambda x: dt.strptime(x[0:10], '%Y-%m-%d'))
observation_df["resource.code.code"] = observation_df["resource.code.coding"].apply(lambda x: extract_one_subitem_by_name(x, 'code'))
observation_df["resource.code.display"] = observation_df["resource.code.coding"].apply(lambda x: extract_one_subitem_by_name(x, 'display'))


resource_code_display = observation_df["resource.code.display"].unique()



sel_patient = observation_df["resource.subject.reference"].value_counts().index[0]
print(sel_patient)
obs_subset_df = observation_df.loc[observation_df["resource.subject.reference"]==sel_patient]

sel_obs_columns = ["resource.code.display", "resource.effectiveDateTime", "resource.valueQuantity.value",
               "resource.valueQuantity.unit","resource.valueQuantity.system","resource.valueQuantity.code", "date"]


resource_code_display = obs_subset_df["resource.code.display"].unique()









