import os
import random
import openai
from dotenv import load_dotenv

load_dotenv()

openai.api_key = os.getenv("OPENAI_API_KEY")
completion = openai.Completion

# start_sequence = "\nNero:"
restart_sequence = "\n\n##\nUser:"
classfication_sequence = "Is this a travel question:"
session_prompt = open('training_data/base_prompt.txt', 'r').read()

def ask(question, chat_log=None):
    formatted_ques = build_prompt(question)
    if chat_log is None:
      chat_log = session_prompt
    prompt_text = f'{chat_log}{formatted_ques}'
    response = openai.Completion.create(
      engine="davinci",
      prompt=prompt_text,
      temperature=0.9,
      max_tokens=150,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0.3,
      stop=["##"],
    )
    story = response['choices'][0]['text']
    # x = int(random.random()*100)
    # print (x)
    # story = ( 'Yes' if x%2==1 else 'No' ) + '\nNero: I say hi /hello. Is anybody in there, now? Just nod if you can hear me. Is there anyone at home?'
    return story

def append_interaction_to_chat_log(question, answer, chat_log=None):
    formatted_ques = build_prompt(question)
    if chat_log is None:
      chat_log = session_prompt
    log_append = f'{chat_log}{formatted_ques}{answer}'
    print (log_append)
    return log_append

def build_prompt(question):
    return f'{restart_sequence} {question}\n{classfication_sequence}'

def classify_response(answer: str):
    return answer.split('\n')[1]