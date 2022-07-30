from json import load, dumps

class Load():
    def __init__(self) -> None:
        self.items = load_file("items")
        self.scrolls = load_file("scrolls")
        self.tables = load_file("tables")
        self.shop_types = load_file("shops")

def load_file(file_name: str) -> dict or None:
    """ Load JSON file """
    try:
        with open(f"config/{file_name}.json", "r") as file:
            return load(file)
    except:
        return

def save_file(file_name: str, data: dict):
    """ Save to a .txt file as JSON """
    with open(f'config/{file_name}.json', 'w+') as file:
        file.write(dumps(data))
