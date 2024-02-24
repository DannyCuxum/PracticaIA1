package com.example.controllers;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class Llamada {

    @GetMapping("/app/foo")
    public Map<String,String> foo(){

        Map<String,String> json = new HashMap<>();
        json.put("message: ", "Hola perros");

        return json;
    }

}
