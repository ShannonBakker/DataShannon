import json
import csv

# inspiration from: http://stackoverflow.com/questions/19697846/python-csv-to-json

# load the files
csvf = open('ei_lmhr_m_1_Data.csv', 'r')
jsonf = open('unemployement.json', 'w+')

# put the csv in json format
fieldnames = ['country', 'data']
reader = csv.DictReader(csvf, fieldnames=fieldnames)
data_rows = []
for row in reader:
    data_rows.append(row) 
data = {"data" : data_rows}


# write the data to the json-file
print data
json.dump(data, jsonf)
jsonf.close()  


