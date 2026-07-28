from llama_cpp import Llama

_model = None

def load_model():
    global _model

    if _model is None:
        _model = Llama(
            model_path="../models/qwen3-4b/Qwen3-4B-Instruct-2507-UD-Q4_K_XL.gguf",
            n_ctx=8192,
            n_threads=8,
            verbose=False
        )
    return _model

def generate_response(prompt:str):
    model = load_model()

    output = model.create_chat_completion(
        messages=[
            {"role": "user", "content": prompt}
        ],
        max_tokens=1024,
        temperature=0.3
    )
    return output["choices"][0]["message"]["content"]