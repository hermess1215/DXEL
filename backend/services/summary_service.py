import json
import re
from ai.qwen_model import generate_response
from ai.prompts import summary_prompt

def extract(transcript_text:str):
    prompt = summary_prompt(transcript_text)
    response = generate_response(prompt)

    cleaned = clean_json_text(response)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError:
        result = {
            "summary": "",
            "decisions": [],
            "todos": [],
            "next_agenda": [],
            "error": "Json 해석 실패"
        }
        
    return result

def clean_json_text(text:str):
    text = text.strip()

    if text.startswith("```"):
        text = text.split("```")[1]

        if text.startswith("json"):
            text = text[4:]

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1:
        text = text[start:end + 1]

    text = re.sub(r':\s*"null"', ': null', text)

    return text.strip()