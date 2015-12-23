package com.bee.smartstadium.ui.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by BZ02973 on 23.12.2015.
 * Les use cases que j'ai imaginé (que vous pouvez complétez):
 1. Vérifier Tag : Vérifie si le tag est enregistrer sur le serveur + Vérifie si le mec a une place
 2. Enregistrer Tag : Enregistre l'UID sur le serveur + créer un record accusé de réception dans le tag
 3. Acheter billet : Enregistre UID si pas déjà enregistré + donne un billet (=nb place, numéro de place, description en JSON)
 4. Reset Tag
 5. Lire Tag
 */
@RestController
@RequestMapping("/nfc")
public class NfcResource {

    private Map<String, String> tags = new HashMap<>();

    @RequestMapping("/verify")
    public boolean verify(String nfcTag){
        return true;
    }

    @RequestMapping("/read")
    public boolean read(String nfcTag){
        return true;
    }

    @RequestMapping("/reset")
    public boolean reset(String nfcTag){
        return true;
    }



}
