import json
import csv

# inspiration from: http://stackoverflow.com/questions/19697846/python-csv-to-json

# load the files
csvf = open('gdp-world.csv', 'r')
jsonf = open('data.json', 'w+')

# put the csv in json format
reader = csv.reader(csvf)
data_rows = []
for row in reader:
    print row
    data_rows.append(row)
data = data_rows


# write the data to the json-file
json.dump(data, jsonf)
jsonf.close()
csvf.close()


