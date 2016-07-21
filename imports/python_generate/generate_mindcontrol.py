__author__ = 'akeshavan'
from jinja2 import Environment, FileSystemLoader
from nipype.utils.filemanip import load_json

env = Environment(loader=FileSystemLoader('./'))
template = env.get_template("module_tables.js.tmpl")
info = load_json("generator.json")
#print(template.render(**info))

template = env.get_template("module_templates.js.tmpl")
#print(template.render(**info))
template = env.get_template("module_templates.html.tmpl")
print(template.render(**info))