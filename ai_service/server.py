from flask import Flask, request, jsonify
from datetime import datetime

app = Flask(__name__)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"ok": True, "service": "ai", "time": datetime.utcnow().isoformat()})

@app.route('/nlp/echo', methods=['POST'])
def nlp_echo():
    data = request.get_json(force=True, silent=True) or {}
    text = data.get('text', '')
    return jsonify({
        "input": text,
        "echo": f"Echo from AI microservice: {text}",
        "length": len(text)
    })

@app.route('/voice/transcribe', methods=['POST'])
def voice_transcribe():
    data = request.get_json(force=True, silent=True) or {}
    audio_b64 = data.get('audioBase64')
    transcript = "This is a dummy transcript (replace with real STT)."
    return jsonify({
        "transcript": transcript,
        "receivedAudio": bool(audio_b64)
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)