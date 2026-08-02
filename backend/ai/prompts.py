def summary_prompt(transcript: str) -> str:
    prompt = f"""다음은 회의 전사 내용입니다. 이 내용을 분석해서 아래 JSON 형식으로만 응답하세요. 
다른 설명이나 인사말 없이 JSON만 출력하세요.
값이 없는 경우 반드시 따옴표 없는 null을 사용하세요 (예: "assignee": null, "assignee": "null"이 아님).

형식:
{{
  "summary": "회의 전체 내용을 3~4문장으로 요약",
  "decisions": ["결정된 사항 1", "결정된 사항 2"],
  "todos": [
    {{"task": "할 일 내용", "assignee": "담당자 이름 또는 null", "due": "기한(예: 6/26) 또는 null"}}
  ],
  "next_agenda": ["다음 회의에서 다룰 안건 1", "안건 2"],
}}

회의 전사 내용:
{transcript}
"""
    return prompt

def cleaned_summary_prompt(transcript: str) -> str:
    prompt = f"""다음은 회의 음성을 그대로 받아적은 전사 원문입니다.
이 내용에서 "어", "음", "그니까", "저기", "그래서 이제" 같은 군말과 반복되는 표현만 제거하고,
문장을 자연스럽게 다듬어서 정리해주세요.

지켜야 할 규칙:
- 원래 말한 내용과 의미, 순서를 절대 바꾸지 마세요.
- 새로운 내용을 추가하거나 요약하지 마세요. 있는 그대로의 내용을 다듬기만 하세요.
- 다른 설명이나 인사말 없이, 정리된 텍스트만 출력하세요.

전사 원문:
{transcript}
"""
    return prompt