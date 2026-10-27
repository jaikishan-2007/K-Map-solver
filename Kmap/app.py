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

gray_code = {
    "00": 0,
    "01": 1,
    "11": 2,
    "10": 3
}
def get_kmap_position(binary, variables):
    match variables:
        case 2:
            row = int(binary[0])
            col = int(binary[1])

        case 3:
            row = int(binary[0])
            col = gray_code[binary[1:3]]

        case 4:
            row = gray_code[binary[0:2]]
            col = gray_code[binary[2:4]]

        case _:
            return None

    return row, col

def generate_kmap(variables, minterms,dont_cares=None):

    if dont_cares is None:
        dont_cares = []

    if variables ==2:
        rows =2
        cols =2

    elif variables ==3:
        rows =2
        cols =4

    elif variables ==4:
        rows =4
        cols =4

    else:
        return None

    kmap = [[0 for _ in range(cols)] for _ in range(rows)]
    for minterm in minterms:
        binary = decimal_to_binary(minterm, variables)
        row, col = get_kmap_position(binary, variables)
        kmap[row][col] = 1


    for term in dont_cares:
        binary = decimal_to_binary(term, variables)
        row, col = get_kmap_position(binary, variables)
        kmap[row][col] = "X"

    
    return kmap


# Chart GPT

def simplify_boolean(variables, minterms, dont_cares=None):
    if dont_cares is None:
        dont_cares = []

    minterms = sorted(set(minterms))
    dont_cares = sorted(set(dont_cares))

    if not minterms:
        return "F = 0"

    if len(minterms) == 2 ** variables:
        return "F = 1"

    variable_names = "ABCD"[:variables]

    # Combine minterms and don't-care terms as candidates.
    all_terms = sorted(set(minterms) | set(dont_cares))

    # Each item contains a binary pattern and the original minterms
    # represented by that pattern.
    terms = [
        (decimal_to_binary(m, variables), frozenset([m]))
        for m in all_terms
    ]

    prime_implicants = []

    while terms:
        used = set()
        combined_terms = {}

        for i in range(len(terms)):
            for j in range(i + 1, len(terms)):
                a, covered_a = terms[i]
                b, covered_b = terms[j]

                # Patterns must have dashes in the same positions.
                if any(
                    (a[k] == "-") != (b[k] == "-")
                    for k in range(variables)
                ):
                    continue

                differences = [
                    k for k in range(variables)
                    if a[k] != b[k]
                ]

                # Combine only if exactly one 0/1 bit differs.
                if (
                    len(differences) == 1
                    and a[differences[0]] != "-"
                    and b[differences[0]] != "-"
                ):
                    k = differences[0]
                    pattern = a[:k] + "-" + a[k + 1:]
                    covered = covered_a | covered_b

                    combined_terms[(pattern, covered)] = (
                        pattern, covered
                    )

                    used.add(i)
                    used.add(j)

        # Terms that cannot be combined are prime implicants.
        for i, term in enumerate(terms):
            if i not in used:
                prime_implicants.append(term)

        terms = list(combined_terms.values())

    # Keep only implicants that cover at least one required minterm.
    required_minterms = set(minterms)

    prime_implicants = [
        (pattern, covered & required_minterms)
        for pattern, covered in prime_implicants
        if covered & required_minterms
    ]

    # Find the smallest number of implicants that covers all minterms.
    from itertools import combinations

    selected = []

    for size in range(1, len(prime_implicants) + 1):
        for group in combinations(prime_implicants, size):
            covered = set()

            for pattern, minterm_set in group:
                covered.update(minterm_set)

            if covered == required_minterms:
                selected = group
                break

        if selected:
            break

    # Convert the selected binary patterns to Boolean expressions.
    expressions = []

    for pattern, _ in selected:
        parts = []

        for i, bit in enumerate(pattern):
            if bit == "1":
                parts.append(variable_names[i])
            elif bit == "0":
                parts.append(variable_names[i] + "'")

        expressions.append("".join(parts) if parts else "1")

    return "F = " + " + ".join(expressions)

# Chart GPT end



@app.route("/")
def home():
    return render_template("index.html")


@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    variables = data.get("variables")
    minterms = data.get("minterms", [])
    dont_cares = data.get("dontCares", [])

    kmap = generate_kmap(variables, minterms, dont_cares)
    simplified = simplify_boolean(variables, minterms, dont_cares)

    return {
        "message": "K-map generated successfully",
        "variables": variables,
        "minterms": minterms,
        "dontCares": dont_cares,
        "kmap": kmap,
        "simplified": simplified
    }

if __name__ == "__main__":
    app.run(debug=True)