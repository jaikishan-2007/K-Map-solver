
const btn = document.getElementById("generateBtn");
btn.addEventListener("click",function(){
    console.log("button clicked");
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "";

    const mintermsInput = document.getElementById("Minterms");
    console.log(mintermsInput.value);

    const Variable_select = document.getElementById("numVariables");
    console.log(Variable_select.value);

   if (mintermsInput.value.trim() === "") {
    errorMessage.textContent = "Please enter at least one minterm.";
    return;
}

    const minterms = mintermsInput.value.split(",");
    console.log(minterms);

for (let i = 0; i < minterms.length; i++) {
    if (minterms[i].trim() === "") {
        console.log("Invalid input: empty minterm value");
        errorMessage.textContent ="Invalid input: Please remove empty entries between commas.";
        return;
    }
}

    const mintermNumbers = minterms.map(Number);
    console.log(mintermNumbers);

    const uniqueMinterms = [...new Set(mintermNumbers)];// ... means convert back to array from set
    console.log(uniqueMinterms);

    const Variable_select_number = Number(Variable_select.value);
    console.log(Variable_select_number);

  const isValidVariables = validateVariables(Variable_select_number);
const isValidMinterms = validateMinterms(uniqueMinterms, Variable_select_number);

console.log("Variables valid:", isValidVariables);
console.log("Minterms valid:", isValidMinterms);

const dontCaresInput = document.getElementById("dontCares");
const dontCaresText = dontCaresInput.value.trim();

let dontCares = [];

if (dontCaresText !== "") {
    const dontCaresArray = dontCaresText.split(",");

for (let i = 0; i < dontCaresArray.length; i++) {
    if (dontCaresArray[i].trim() === "") {
        console.log("Invalid input: empty don't-care value");
        errorMessage.textContent ="Invalid input: Please remove empty don't-care entries.";
        return;
    }
}

    dontCares = dontCaresArray.map(Number);
    dontCares = [...new Set(dontCares)];
}

const isValidDontCares = validateMinterms(dontCares,Variable_select_number);

if (!isValidVariables || !isValidMinterms || !isValidDontCares) {
    errorMessage.textContent =
        "Please enter valid minterms and don't-care values for the selected variables.";
    return;
}

for (let i = 0; i < dontCares.length; i++) {
    if (uniqueMinterms.includes(dontCares[i])) {
        errorMessage.textContent =
            "Error: A number cannot appear in both minterms and don't-cares.";
        return;
    }
}

console.log("Validation passed");

// Chat GPT
//Send the data to the server for K-map generation

fetch("/generate", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        variables: Variable_select_number,
        minterms: uniqueMinterms,
        dontCares: dontCares
    })
})
.then(response => {
    if (!response.ok) {
        throw new Error("Server returned an error");
    }
    return response.json();
})
.then(data => {
    console.log(data);

    const result = document.getElementById("kmapResult");
    const kmap = data.kmap;
    const variables = data.variables;

    const grayLabels = ["00", "01", "11", "10"];

    let html = "<h2>K-Map</h2>";
    html += "<table border='1' cellpadding='12' style='border-collapse:collapse; text-align:center;'>";

    // Column headings
    html += "<tr>";

    if (variables === 2) {
        html += "<th>A/B</th><th>0</th><th>1</th>";
    } else if (variables === 3) {
        html += "<th>A/BC</th>";
        for (let label of grayLabels) {
            html += "<th>" + label + "</th>";
        }
    } else {
        html += "<th>AB/CD</th>";
        for (let label of grayLabels) {
            html += "<th>" + label + "</th>";
        }
    }

    html += "</tr>";

    // K-map rows
    for (let i = 0; i < kmap.length; i++) {
        html += "<tr>";

        // Row heading
        if (variables === 2 || variables === 3) {
            html += "<th>" + i + "</th>";
        } else {
            html += "<th>" + grayLabels[i] + "</th>";
        }

        // K-map cell values
        for (let j = 0; j < kmap[i].length; j++) {
            html += "<td>" + kmap[i][j] + "</td>";
        }

        html += "</tr>";
    }

    html += "</table>";

    // Simplified Boolean expression
    html += "<h2>Simplified Boolean Expression</h2>";
    html += "<p>" + data.simplified + "</p>";

    result.innerHTML = html;
})
.catch(error => {
    console.error("Error generating K-map:", error);
    errorMessage.textContent ="Unable to generate the K-map. Please try again.";
});


});
// END of Chat GPT

function validateVariables(variableCount){
    switch(variableCount){
        case 2:
            return true;
        case 3:
            return true;
        case 4:
            return true;
            
        default:
            return false;
    }

}

function validateMinterms(minterms, variableCount){
    switch(variableCount){
        case 2:
            for(let i=0;i<minterms.length;i++){
                if(!Number.isInteger(minterms[i])){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
                if(minterms[i] < 0 || minterms[i] > 3){
                    console.log("Enter valid minterms for selected number of variables");
                return false;
                }
            }
        return true;
        
        
        case 3:
            for(let i=0;i<minterms.length;i++){
                if(!Number.isInteger(minterms[i])){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
                if(minterms[i] < 0 || minterms[i] > 7){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
            }
        return true;
        

        case 4:
            for(let i=0;i<minterms.length;i++){
                if(!Number.isInteger(minterms[i])){
                    console.log("Enter valid minterms for selected number of variables");
                    return false;
                }
                if(minterms[i] < 0 || minterms[i] > 15){
                    console.log("Enter valid minterms for selected number of variables");
                return false;
                }
            
            }
        return true;
        

        default:
            console.log("Enter valid minterms for selected number of variables");
            return false;
            
    }


}