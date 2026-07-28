def summary_prompt(transcript_text: str) -> str:
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
{transcript_text}
"""
    return prompt