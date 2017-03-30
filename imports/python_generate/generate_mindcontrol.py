__author__ = 'akeshavan'
from jinja2 import Environment, FileSystemLoader
import simplejson as json
import os

def load_json(filename):
    with open(filename,'r') as fp:
        data=json.load(fp)
    return data

files_to_generate = [{"filename": "module_tables.js.tmpl", "location":"../api/"},
                     {"filename": "module_templates.js.tmpl", "location":"../ui/"},
                     {"filename": "module_templates.html.tmpl", "location": "../ui/"}]

env = Environment(loader=FileSystemLoader('./'))
info = load_json("generator.json")

for f in files_to_generate:
    template = env.get_template(f["filename"])
    outfile = os.path.join(f["location"], f["filename"].replace(".tmpl",""))
    print("writing", outfile)
    with open(outfile, "w") as q:
        q.write(template.render(**info))
#print(template.render(**info))

"""
template = env.get_template("module_templates.js.tmpl")
#print(template.render(**info))
template = env.get_template("module_templates.html.tmpl")
print(template.render(**info))
"""