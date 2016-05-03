import json
import csv

# inspiration from: http://stackoverflow.com/questions/19697846/python-csv-to-json

# load the files
csvf = open('Hotels__gasten,_regi_190416121814.csv', 'r')
jsonf = open('tourists.json', 'w+')

# put the csv in json format
fieldnames = ['Month', 'foreign_tourists']
reader = csv.DictReader(csvf, fieldnames=fieldnames)
data_rows = []
for row in reader:
    data_rows.append(row)
data = {"data" : data_rows}


# write the data to the json-file
json.dump(data, jsonf)
jsonf.close()
csvf.close()


