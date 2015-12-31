package com.bee.smartstadium.ui.rest;

import com.bee.smartstadium.ui.model.Tag;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;

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
@RequestMapping("/nfcs")
public class NfcSecurisedResource {

    private Map<String, Tag> tags = new HashMap<>();

    public NfcSecurisedResource(){
        if(tags.isEmpty()){
            tags.put("active1", mockTag("active1", true));
            tags.put("active2", mockTag("active2", true));
            tags.put("active3", mockTag("active3", true));

            tags.put("inactive1", mockTag("inactive1", false));
            tags.put("inactive2", mockTag("inactive2", false));
            tags.put("inactive3", mockTag("inactive3", false));
        }
    }

    @RequestMapping("/")
    public List<Tag> list(){
        return new ArrayList<Tag>(tags.values());
    }

    @RequestMapping("/{nfcTag}")
    public String read(@PathVariable String nfcTag){
        if(verify(nfcTag)){
            return tags.get(nfcTag).getContent();
        }
        return "[NFC TAG INVALID]";
    }

    @RequestMapping("/verify/{nfcTag}")
    public boolean verify(@PathVariable String nfcTag){
        return (tags.containsKey(nfcTag) && tags.get(nfcTag).isActive());
    }

    @RequestMapping("/reset/{nfcTag}")
    public boolean reset(@PathVariable String nfcTag){
        if(verify(nfcTag)){
            tags.get(nfcTag).setContent("[CONTENT RESET OK]");
        }
        return true;
    }


    private Tag mockTag(String uid, boolean active){
        Tag t = new Tag();
        t.setUid(uid);
        t.setContent(uid+"_content");
        t.setReadCount(0);
        t.setActive(active);
        Calendar start = Calendar.getInstance();
        start.add(Calendar.DATE, -30);
        Calendar end = Calendar.getInstance();
        end.add(Calendar.DATE, (active ? 30 : -5));

        t.setValidityStart(start.getTime());
        t.setValidityEnd(end.getTime());

        return t;
    }

}
