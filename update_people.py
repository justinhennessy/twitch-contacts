import yaml
import json
import re

# Read the JavaScript object from the file
with open("update.txt", "r") as file:
    js_object_str = file.read()

# Convert JavaScript object notation to JSON
js_object_str = re.sub(r'(\w+):', r'"\1":', js_object_str)  # Handle property names
js_object_str = js_object_str.replace("'", '"')  # Handle string values

# Convert the JSON string to a Python dictionary
data_dict = json.loads(js_object_str)

# Convert the Python dictionary to YAML
yaml_str = yaml.dump(data_dict, default_flow_style=False)

# Save the YAML string to a file
with open("output.yaml", "w") as yaml_file:
    yaml_file.write(yaml_str)

print("Data has been saved to output.yaml")
