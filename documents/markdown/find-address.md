### **URL**

  **_/postcode/:code_**

* **Method:**

  `GET`

    ----
  
*  **URL Requirements**

    ----
    ----
    <br />

    **Example :**

   `/postcode/W1B3AG`


    <br />

    _**Header without session**:_

    ```json
        {}
    ```
      - in this case a session is going to be created and returned in headers under session name field
      <br/><br/>

     _**Header with session**:_

    ```json
        {
            "session": "user_session",
        }
    ```

    - in this case up to the last three research's made is going to be retrieved among with the current one
      <br/><br/>


    <br />

    ----

    ### **Success :**

    * **Code:** 200 <br />
      **Content:** `{[region": "London", ...]},`
    <br/><br/>
    
    ### **Error :**

    * **Code:** 500 <br />
      **Content:** `{ error: Internal server Error }`

    <br />

    ----
    ----