import argparse
from poe_api_wrapper import AsyncPoeApi
import asyncio

# Tokens for authentication
tokens = {
    'p-b': '', 
    'p-lat': '',
    'formkey': ''
}

# Main asynchronous function
async def main(prompt):
    client = await AsyncPoeApi(tokens=tokens).create()
    async for chunk in client.send_message(bot="gpt3_5", message=prompt):
        pass
    print(chunk["text"])

# Entry point for the script
if __name__ == "__main__":
    # Parse command-line arguments
    parser = argparse.ArgumentParser(description="Send a prompt to the Poe API and get a response.")
    parser.add_argument(
        "-prompt",
        type=str,
        required=True,
        help="The prompt to send to the Poe API."
    )
    args = parser.parse_args()

    # Run the main function with the provided prompt
    asyncio.run(main(args.prompt))
