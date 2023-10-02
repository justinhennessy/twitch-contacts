from flask import Flask, request, send_from_directory, jsonify
import yaml
from dotenv import load_dotenv
from oauth import request_oauth_token
from datetime import datetime
import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__, static_folder='public')
load_dotenv()

# Configure logging
logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s [Process %(process)d] [%(levelname)s] - %(message)s')

handler = RotatingFileHandler('app.log', maxBytes=5*1024*1024, backupCount=5)
logging.getLogger().addHandler(handler)

logger = logging.getLogger(__name__)

class Person:
    def __init__(self, username, real_name, first_chatted, last_chatted, location='', chatter_type='unknown', interaction_count=0, aspirations='', journal=[], message_count=0):
        self.username = username
        self.realName = real_name
        self.location = location
        self.chatter_type = chatter_type
        self.interaction_count = interaction_count
        self.aspirations = aspirations
        self.message_count = message_count
        self.journal = journal
        self.first_chatted = first_chatted
        self.last_chatted = last_chatted


def load_people_data_from_yaml(yaml_str):
    data = yaml.load(yaml_str, Loader=yaml.FullLoader)

    people = []
    for person_data in data.get('data', []):
        person = Person(
            person_data.get('username'),
            person_data.get('realName'),
            person_data.get('first_chatted'),
            person_data.get('last_chatted'),
            person_data.get('location'),
            person_data.get('chatter_type'),
            person_data.get('interaction_count', 0),
            person_data.get('aspirations'),
            person_data.get('journal'),
            person_data.get('message_count', 0)
        )
        people.append(person)
    return people

def reset_messages_count():
    filename = 'people.yaml'
    try:
        with open(filename, 'r') as file:
            data = yaml.load(file, Loader=yaml.FullLoader)
            print('Resetting message counts ...')

            for person_data in data.get('data', []):
                # Reset the message_count to 0
                person_data['message_count'] = 0

        # Write the updated data back to the same file
        with open(filename, 'w') as file:
            yaml.dump(data, file, default_flow_style=False)

        print(f"Message counts reset and saved to {filename}")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

@app.route('/')
def index():
    return send_from_directory('public', 'index.html')

@app.route('/<path:filename>')
def serve_static_file(filename):
    return send_from_directory(app.static_folder, filename)

@app.route('/log', methods=['GET'])
def log():
    data = request.json
    print('Data logged from client:', data)

    yaml_str = yaml.dump(data)
    with open('update.yaml', 'w') as file:
        file.write(yaml_str)
    return '', 200

@app.route('/message_count', methods=['POST'])
def message_count():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"error": "Username not provided"}), 400

    with open('people.yaml', 'r') as file:
        people_list = yaml.safe_load(file)['data']

    user_found = False
    for person in people_list:
        if person['username'].lower() == username.lower():
            user_found = True
            if person['chatter_type'] != 'bot':
                person['message_count'] += 1
                person['last_chatted'] = datetime.now().strftime("%Y-%m-%d")
                action = "incremented"
                logger.info(f"Message count incremented for user {username}, and last_chatted updated")
            else:
                logger.info(f"{person['username'].lower()} was a bot, no changes were made")
                return jsonify({"message": f"User {username} was a bot, no changes were made"}), 200

    if not user_found and username.lower() != 'bot':
        current_date = datetime.now().strftime("%Y-%m-%d")
        new_person = {
            'username': username,
            'chatter_type': 'known',
            'message_count': 1,
            'first_chatted': current_date,
            'last_chatted': current_date
        }
        people_list.append(new_person)
        action = "added"

    updated_yaml_str = yaml.dump({"data": people_list})
    with open('people.yaml', 'w') as file:
        file.write(updated_yaml_str)

    if action == "incremented":
        return jsonify({"message": f"Message count incremented for user {username}, and last_chatted updated"}), 200
    elif action == "added":
        return jsonify({"message": f"User {username} added and message count incremented"}), 200

@app.route('/journal', methods=['GET', 'POST'])
def journal():

    if request.method == 'GET':
        return "I am up", 200

    data = request.json
    username = data.get('username')
    entry = data.get('entry')

    if not username or not entry:
        return jsonify({"error": "Username or entry not provided"}), 400

    with open('people.yaml', 'r') as file:
        people_list = yaml.safe_load(file)['data']

    user_found = False
    for person in people_list:
        if person['username'].lower() == username.lower():
            user_found = True
            journal_entry = {
                'date': datetime.now().strftime("%Y-%m-%d"),
                'entry': entry
            }
            person['journal'].append(journal_entry)
            break

    if not user_found:
        return jsonify({"error": f"No user found with username {username}"}), 404

    updated_data = {"data": people_list}
    updated_yaml_str = yaml.dump(updated_data)

    with open('people.yaml', 'w') as file:
        file.write(updated_yaml_str)

    return jsonify({"message": f"Journal updated for user {username}"}), 200


@app.route('/people', methods=['GET'])
def people():
    with open('people.yaml', 'r') as file:
        yaml_str = file.read()
    parsed_yaml = yaml.load(yaml_str, Loader=yaml.FullLoader)
    return jsonify(parsed_yaml.get('data', []))

if __name__ == '__main__':
    reset_messages_count()
    # Start the Flask app in a separate thread
    from threading import Thread
    def start_app():
        app.run(port=3000)

    app_thread = Thread(target=start_app)
    app_thread.start()
