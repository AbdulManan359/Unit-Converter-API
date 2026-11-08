// The API is completely built.
import express from "express";
import { readFile } from "node:fs";

const app = express();

const prefixes = [
    { name: "quetta", symbol: "Q", value: 10 ** (30) },
    { name: "ronna", symbol: "R", value: 10 ** (27) },
    { name: "yotta", symbol: "Y", value: 10 ** (24) },
    { name: "zetta", symbol: "Z", value: 10 ** (21) },
    { name: "exa", symbol: "E", value: 10 ** (18) },
    { name: "peta", symbol: "P", value: 10 ** (15) },
    { name: "tera", symbol: "T", value: 10 ** (12) },
    { name: "giga", symbol: "G", value: 10 ** (9) },
    { name: "mega", symbol: "M", value: 10 ** (6) },
    { name: "kilo", symbol: "k", value: 10 ** (3) },
    { name: "hecto", symbol: "h", value: 10 ** (2) },
    { name: "deca", symbol: "da", value: 10 ** (1) },
    { name: "deci", symbol: "d", value: 10 ** (-1) },
    { name: "centi", symbol: "c", value: 10 ** (-2) },
    { name: "milli", symbol: "m", value: 10 ** (-3) },
    { name: "micro", symbol: "μ", value: 10 ** (-6) },
    { name: "nano", symbol: "n", value: 10 ** (-9) },
    { name: "pico", symbol: "p", value: 10 ** (-12) },
    { name: "femto", symbol: "f", value: 10 ** (-15) },
    { name: "atto", symbol: "a", value: 10 ** (-18) },
    { name: "zepto", symbol: "z", value: 10 ** (-21) },
    { name: "yocto", symbol: "y", value: 10 ** (-24) },
    { name: "ronto", symbol: "r", value: 10 ** (-27) },
    { name: "quecto", symbol: "q", value: 10 ** (-30) },
];

function prefixValueFinder(symbol) {
    let value;
    for (let i = 0; i < prefixes.length; i++) {
        if (prefixes[i].symbol === symbol) {
            value = prefixes[i].value;
        }
    };
    return value;
}









// Now, here I only have to add Authentication using an API Key.


app.get("/convert", async (req, res) => {

    let inputQName = req.query.inputQName;
    const inputQSymbol = req.query.inputQSymbol;
    const inputBUnit = req.query.inputBaseUnit;
    let inputValue = Number(req.query.inputValue);
    const outputBUnit = req.query.outputBaseUnit

    let inputPrefix = req.query.inputPrefix; //optional
    if (inputPrefix !== undefined) {
        inputPrefix = inputPrefix.trim();
    }
    let outputPrefix = req.query.outputPrefix; //optional
    if (outputPrefix !== undefined) {
        outputPrefix = outputPrefix.trim();
    }



    if (inputQName !== undefined) {
        inputQName = inputQName.trim();
        inputQName = inputQName.toLowerCase();
        const firstString = inputQName[0].toUpperCase();
        const remaining = inputQName.slice(1);
        inputQName = firstString + remaining;
    }



    if (inputQName === undefined || inputQSymbol === undefined || Number.isNaN(inputValue) || outputBUnit === undefined || inputBUnit === undefined) {
        res.status(400).json({
            requestStatus: "Incomplete",
            errorCode: "400-Bad Request",
            errorMessage: "The required data is either undefined or null. Kindly recheck query parameters"
        });
    } else {

        try {
            readFile("./Physical Quantities.json", "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        requestStatus: "Incomplete",
                        errorCode: "500-Internal Server Error",
                        errorMessage: "Sorry,there is an error processing your request."
                    })
                } else {

                    const k = JSON.parse(data);

                    let dataStored = k.filter((element) => element.symbol === inputQSymbol && element.name === inputQName);


                    dataStored = dataStored[0];






                    // Find SI-Unit Factor from the array
                    if (dataStored !== undefined) {
                        const array1 = dataStored['SI-Unit Conversion Factors'];


                        const factor = array1.find((element) => element.unit === inputBUnit);

                        if (factor !== undefined) {

                            const SI_Unit_Factor = factor.factor;
                            const SI_Unit_Offset = factor.offset ?? 0;

                            const SI_Unit_Prefix_Power = factor.power ?? 1;






                            //Find prefixValue
                            let inputPrefixValue = prefixValueFinder(inputPrefix);
                            let outputPrefixValue = prefixValueFinder(outputPrefix);




                            // SI Unit Value
                            let SI_Unit_Value;
                            if (inputPrefixValue !== undefined) {
                                inputPrefixValue = inputPrefixValue ** SI_Unit_Prefix_Power;
                                SI_Unit_Value = ((SI_Unit_Factor * inputValue) + SI_Unit_Offset) * inputPrefixValue;


                            } else if (inputPrefixValue === undefined) {
                                SI_Unit_Value = (SI_Unit_Factor * inputValue) + SI_Unit_Offset;

                            }




                            // Output Base Unit Factor Finder
                            const array2 = dataStored['SI-Units to Other Units Factors'];




                            const resultingUnitArray = array2.find((element) => element.resultingUnit === outputBUnit)

                            if (resultingUnitArray !== undefined) {

                                const resultingUnitFactor = resultingUnitArray.factor;

                                const resultingUnitOffset = resultingUnitArray.offset ?? 0;

                                const resultingUnit_Prefix_Power = resultingUnitArray.power ?? 1;


                                // Find Value for the resulting base unit
                                let semiFinalOutput = resultingUnitFactor * SI_Unit_Value;
                                semiFinalOutput = semiFinalOutput + resultingUnitOffset;

                                // Adjust the prefix to the base unit value
                                let finalOutput;
                                if (outputPrefixValue !== undefined) {
                                    outputPrefixValue = outputPrefixValue ** resultingUnit_Prefix_Power;
                                    finalOutput = semiFinalOutput / outputPrefixValue;
                                } else if (outputPrefixValue === undefined) {
                                    finalOutput = semiFinalOutput;
                                }


                                delete dataStored['SI-Units to Other Units Factors'] && delete dataStored['SI-Unit Conversion Factors'];


                                const outputOfAPI = {
                                    requestStatus: "Completed",
                                    data: {
                                        input: {
                                            complete: inputValue + ` ${inputPrefix ?? ''}${inputBUnit}`,
                                            value: inputValue,
                                            unit: `${inputPrefix ?? ''}${inputBUnit}`
                                        },
                                        output: {
                                            complete: finalOutput + ` ${outputPrefix ?? ''}${outputBUnit}`,
                                            value: finalOutput,
                                            unit: `${outputPrefix ?? ''}${outputBUnit}`
                                        }
                                    },
                                    physicalQuantity: { ...dataStored }

                                }

                                res.json(outputOfAPI);
                            } else {
                                delete dataStored['SI-Units to Other Units Factors'] && delete dataStored['SI-Unit Conversion Factors'];
                                res.status(404).json({
                                    requestStatus: "Incomplete-404 Not Found",
                                    message: "Sorry! We are not able to convert to you required unit value. Here is the list of units supported for this Quantity",
                                    physicalQuantity: { ...dataStored }
                                })

                            }
                        } else {
                            delete dataStored['SI-Units to Other Units Factors'] && delete dataStored['SI-Unit Conversion Factors'];
                            res.status(404).json({
                                requestStatus: "Incomplete-404 Not Found",
                                message: "Sorry! We are not able to convert to you required unit value. Here is the list of units supported for this Quantity",
                                physicalQuantity: { ...dataStored }
                            })
                        }

                    } else {
                        res.status(404).json({
                            requestStatus: "Incomplete",
                            errorCode: "404-Not Found",
                            errorMessage: "The requested data or the physical quantity you are searching is not found in our data storage. Kindly, let us know about that."
                        })
                    }
                }
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                requestStatus: "Incomplete",
                reason: "error",
                errorMessage: "Internal Server Error. Sorry! there is an error processing your request."
            })

        }
    }




})


// Make an endpoint whcih will show the all the units supported for a physical quantity by our api

app.get("/checkunits", (req, res) => {

    let inputQName = req.query.inputQName;
    const inputQSymbol = req.query.inputQSymbol;


    if (inputQName !== undefined) {
        inputQName = inputQName.trim();
        inputQName = inputQName.toLowerCase();
        const firstString = inputQName[0].toUpperCase();
        const remaining = inputQName.slice(1);
        inputQName = firstString + remaining;
    }



    if (inputQName === undefined || inputQSymbol === undefined) {
        res.status(400).json({
            requestStatus: "Incomplete",
            errorCode: "400-Bad Request",
            errorMessage: "The required data is either undefined or null. Kindly recheck query parameters"
        });

    } else {
        try {
            readFile("./Physical Quantities.json", "utf-8", (err, data) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        requestStatus: "Incomplete",
                        errorCode: "500-Internal Server Error",
                        errorMessage: "Sorry,there is an error processing your request."
                    })
                } else {
                    const k = JSON.parse(data);

                    let requestedData = k.filter((element) => element.symbol === inputQSymbol && element.name === inputQName);
                    requestedData = requestedData[0];

                    if (requestedData !== undefined) {



                        delete requestedData['SI-Unit Conversion Factors'] && delete requestedData['SI-Units to Other Units Factors'];



                        const outputOfAPI = {
                            requestStatus: "Complete",
                            physicalQuantity: { ...requestedData }
                        }
                        res.json(outputOfAPI);
                    } else {
                        res.status(404).json({
                            requestStatus: "Incomplete",
                            errorCode: "404-Not Found",
                            errorMessage: "The requested data or the physical quantity you are searching is not found in our data storage. Kindly, let us know about that."
                        })

                    }
                }
            })
        } catch (err) {
            console.log(err);
            res.status(500).json({
                requestStatus: "Incomplete",
                reason: "error",
                errorMessage: "Internal Server Error. Sorry! there is an error processing your request."
            })
        }
    }
})

app.listen(3000, () => {
    console.log("Listening to the requests on Port: 3000");
})


