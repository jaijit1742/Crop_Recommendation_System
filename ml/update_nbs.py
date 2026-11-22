import json

def update_main():
    with open("main.ipynb", "r", encoding="utf-8") as f:
        nb = json.load(f)
        
    for cell in nb["cells"]:
        if cell["cell_type"] == "code" and any("float(input" in line for line in cell["source"]):
            new_source = []
            for line in cell["source"]:
                if "ph          = float(input(" in line:
                    new_source.extend([
                        "    while True:\n",
                        "        ph = float(input('Enter pH value (1-10): '))\n",
                        "        if 1 <= ph <= 10:\n",
                        "            break\n",
                        "        print('Invalid pH! Must be between 1 and 10.')\n"
                    ])
                else:
                    new_source.append(line)
            cell["source"] = new_source
            break
            
    with open("main.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=1)

def update_rf():
    with open("Models/random_forest_model.ipynb", "r", encoding="utf-8") as f:
        nb = json.load(f)
        
    # Check if the input cell exists, if not, add it
    has_input = False
    for cell in nb["cells"]:
        if cell["cell_type"] == "code" and any("float(input" in line for line in cell.get("source", [])):
            has_input = True
            new_source = []
            for line in cell["source"]:
                if "ph" in line and "float(input" in line:
                    new_source.extend([
                        "while True:\n",
                        "    ph = float(input('Enter pH value (1-10): '))\n",
                        "    if 1 <= ph <= 10:\n",
                        "        break\n",
                        "    print('Invalid pH! Must be between 1 and 10.')\n"
                    ])
                else:
                    new_source.append(line)
            cell["source"] = new_source
            break
            
    if not has_input:
        new_cell = {
            "cell_type": "code",
            "execution_count": None,
            "metadata": {},
            "outputs": [],
            "source": [
                "import warnings\n",
                "warnings.filterwarnings('ignore', message='X does not have valid feature names')\n",
                "\n",
                "print('Enter the soil and climate values to get a crop recommendation:')\n",
                "N           = float(input('Enter Nitrogen value: '))\n",
                "P           = float(input('Enter Phosphorus value: '))\n",
                "K           = float(input('Enter Potassium value: '))\n",
                "temperature = float(input('Enter Temperature: '))\n",
                "humidity    = float(input('Enter Humidity: '))\n",
                "while True:\n",
                "    ph = float(input('Enter pH value (1-10): '))\n",
                "    if 1 <= ph <= 10:\n",
                "        break\n",
                "    print('Invalid pH! Must be between 1 and 10.')\n",
                "rainfall    = float(input('Enter Rainfall value: '))\n",
                "\n",
                "user_input = [[N, P, K, temperature, humidity, ph, rainfall]]\n",
                "\n",
                "prediction_encoded = model.predict(user_input)\n",
                "predicted_crop = le.inverse_transform(prediction_encoded)\n",
                "\n",
                "print('\\nRecommended Crop:', predicted_crop[0])"
            ]
        }
        nb["cells"].append(new_cell)
        
    with open("Models/random_forest_model.ipynb", "w", encoding="utf-8") as f:
        json.dump(nb, f, indent=1)

update_main()
update_rf()
print("Updated both notebooks successfully!")
