# Unit Converter API

## This API gives information about units of different quantities and also converts a value of a quantity from one unit to another.

### Introduction
Unit Converter API provides:
- Units Information of a Physical quantity
- Converts a value from one unit to another

The output provided will be in the form of a JSON. 
There are 2 endpoints "/checkunits" & "/convert" in this API.
#### /checkunits
First, let's talk about this endpoint. This endpoint takes the following query parameters:
- "inputQName": This is the name of any physical quantity.
- "inputQSymbol": This is the symbol of that physical quantity.
<br>
If we are hosting this API locally here is an example of making a **GET** request to this API for endpoint "/checkunits": <br>

```
  http://localhost:3000/checkunits?inputQName=Time&inputQSymbol=t
```
<br>
And the result will be:
<br>

```
{
  "requestStatus": "Complete",
  "physicalQuantity": {
    "name": "Time",
    "symbol": "t",
    "SI-Unit": {
      "name": "second",
      "symbol": "s"
    },
    "All Units": [ {
        "name": "second",
        "symbol": "s"
      },
      {
        "name": "minutes",
        "symbol": "min."
      },
      {
        "name": "hour",
        "symbol": "h"
      },
      {
        "name": "day",
        "symbol": "d"
      },
      {
        "name": "year",
        "symbol": "yr"
      },
      {
        "name": "fortnight",
        "symbol": "fn"
      }
   ] 
  }
}

```

#### /convert
This endpoint takes 7 input queries and out of which 5 are mandatory and two are optional. These include:
- "inputQName": This is the name of any physical quantity.
- "inputQSymbol": This is the symbol of that physical quantity.
- "inputBaseUnit": This is the initial unit of the quantity before conversion.
- "inputValue": This is the value of that physical quantity with unit "inputBaseUnit".
- "outputBaseUnit": This is the unit of that physical quantity to which you want to convert.
- "inputPrefix" (optional): The prefix symbol like m(milli),c(centi) that are with the input value.
- "outputPrefix" (optional): The prefix symbol which you want to use in your output physical quantity.

<br>
If we are hosting this API locally here is an example of making a **GET** request to this API for endpoint "/convert":

```
http://localhost:3000/convert?inputQName=Time&inputQSymbol=t&inputBaseUnit=s&outputBaseUnit=h&inputValue=4000
```
<br>

And the output will be:

<br>

```
{
  "requestStatus": "Completed",
  "data": {
    "input": {
      "complete": "4000 s",
      "value": 4000,
      "unit": "s"
    },
    "output": {
      "complete": "1.111112 h",
      "value": 1.111112,
      "unit": "h"
    }
  },
  "physicalQuantity": {
    "name": "Time",
    "symbol": "t",
    "SI-Unit": {
      "name": "second",
      "symbol": "s"
    },
    "All Units": [
      {
        "name": "second",
        "symbol": "s"
      },
      {
        "name": "minutes",
        "symbol": "min."
      },
      {
        "name": "hour",
        "symbol": "h"
      },
      {
        "name": "day",
        "symbol": "d"
      },
      {
        "name": "year",
        "symbol": "yr"
      },
      {
        "name": "fortnight",
        "symbol": "fn"
      }
    ]
  }
  }
  
```
<br>

#### How to use it?
- After getting the project files, open the CLI and change your current directory to the project files. Like this:

```
cd Path_to_Project_Folder
```
After that run following command:
```
node index.js
```
(Make sure NodeJS is installed already) You will get the following message: <br>
>  Listening to the requests on Port: 3000
- Now make a GET request to any of the desired endpoints "/checkuntis" OR "/convert" with query parameters to this API.
- And after the request, you will get the results according to the input.
<br>
** Note: ** For reference you can check above commands and resulting JSONs.
