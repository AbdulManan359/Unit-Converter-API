# Unit Converter API

## This API gives information about units of different quantities and also converts a value of a quantity from one unit to another.

### Introduction
Unit Converter API provides:
- Units Information of a Physical quantity
- Converts a value from one unit to another

The output provided will be in the form of a JSON. 
There are 2 endpoints "/checkunits" & "/convert" in this API.
<br> **/checkunits**<br>
First, let's talk about this endpoint. This endpoint takes the following query parameters:
- "inputQName": This is the name of any physical quantity.
- "inputQSymbol": This is the symbol of that physical quantity.
If we are hosting this API locally here is an example of making a **GET** request to this API for endpoint "/checkunits":
  ```
  http://localhost:3000/checkunits?inputQName=Time&inputQSymbol=t
  ```
  And the result will be:
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
