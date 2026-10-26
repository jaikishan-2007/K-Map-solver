from flask import Flask, render_template, request

app = Flask(__name__)

def decimal_to_binary(minterm, variables):
    match variables:
        case 2:
            match minterm:
                case 0: 
                    return "00"
                case 1:
                    return "01"
                case 2:
                    return "10"
                case 3:
                    return "11"
        case 3:
            match minterm:
                case 0:
                    return "000"
                case 1:
                    return "001"
                case 2:
                    return "010"
                case 3:
                    return "011"
                case 4:
                    return "100"
                case 5:
                    return "101"
                case 6:
                    return "110"
                case 7:
                    return "111"
        case 4:
            match minterm:
                case 0:
                    return "0000"
                case 1:
                    return "0001"
                case 2:
                    return "0010"
                case 3:
                    return "0011"
                case 4:
                    return "0100"
                case 5:
                    return "0101"
                case 6:
                    return "0110"
                case 7:
                    return "0111"
                case 8:
                    return "1000"
                case 9:
                    return "1001"
                case 10:
                    return "1010"
                case 11:
                    return "1011"
                case 12:
                    return "1100"
                case 13:
                    return "1101"
                case 14:
                    return "1110"
                case 15:
                    return "1111"
    return None


@app.route("/")
def home():
    return render_template("index.html")

@app.route("/generate", methods=["POST"])
def generate():
    data = request.json
    v = data.get("variables")
    m = data.get("minterms")
    binary = []
    for x in m:
        binary.append(decimal_to_binary(x, v))
        

    print("Received data:", data)
    print("Binary representations:", binary)

    return {
        "message": "Data received successfully",
        "data": data
    }

if __name__ == "__main__":
    app.run(debug=True)