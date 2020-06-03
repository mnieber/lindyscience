_draft_js_content_template = """{
    "entityMap":{},
    "blocks":[{
        "key":"33gtg",
        "text":"%s",
        "type":"unstyled",
        "depth":0,
        "inlineStyleRanges":[],
        "entityRanges":[],
        "data":{}
    }]
}"""


def create_draft_js_content(text):
    return _draft_js_content_template % text
