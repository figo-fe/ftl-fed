# welcome
run freemarker in node, support url route and ajax mock.   
support json and ftlData conversion to each other.   
for example: <#assign name = "figo" /> <==> {"name":"figo"}.   
you can edit mock data in jsoneditor and save in ftl.   
Attention：make sure JAVA is installed and JAVA_HOME is in the PATH

## set ftlRoot
mock/config.json

## server
`[PORT=8080] grunt`(default 80)

## url/ajax config
mock/urlmap.json

## fakeData
in mock folder

## see More
mock/index.html