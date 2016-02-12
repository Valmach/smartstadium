package com.bee.smartstadium.ui.rest;

import com.bee.smartstadium.service.FindPathService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Created by zaid on 12/02/2016
 * A bee-in-it java projects source.
 */
@RestController
@RequestMapping("/path")
public class FindPathResource {

    @Autowired
    private FindPathService service;

    @RequestMapping("/{from}/{to}")
    public List<String> findPath(@PathVariable String from, @PathVariable String to){
        if(!service.started()){
            service.start();
        }
        return service.find(from, to);
    }
}
