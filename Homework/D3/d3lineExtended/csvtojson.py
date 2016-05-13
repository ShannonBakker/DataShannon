import json
import csv

# inspiration from: http://stackoverflow.com/questions/19697846/python-csv-to-json

# load the files
csvf = open('linegraphdata.csv', 'r')
jsonf = open('data.json', 'w+')

# put the csv in json format
fieldnames = ['year','month','day', 'average_temp', 'min_temp','max_temp']
reader = csv.DictReader(csvf, fieldnames=fieldnames)
data_rows = []
for row in reader:
    data_rows.append(row)
data = {"data" : data_rows}


# write the data to the json-file
json.dump(data, jsonf)
jsonf.close()
csvf.close()


