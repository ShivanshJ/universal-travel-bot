from flask import Flask, request, session, render_template
from nerobot import ask, append_interaction_to_chat_log, classify_response

app = Flask(__name__)
# if for some reason your conversation with the bot gets weird, change the secret key 
app.config['SECRET_KEY'] = '89djhff9lhkd93'

@app.route('/nero', methods=['POST'])
def nero():
  incoming_msg = request.values['body']
  chat_log = session.get('chat_log')
  answer = ask(incoming_msg, chat_log)
  session['chat_log'] = append_interaction_to_chat_log(incoming_msg, answer, chat_log)

  # msg = MessagingResponse()
  # msg.message(answer)
  return {'data': classify_response(answer)}

@app.route('/', methods=['GET'])
def main_page():
  return render_template('frontend.html')

if __name__ == '__main__':
    app.run(debug=True, port=7337)