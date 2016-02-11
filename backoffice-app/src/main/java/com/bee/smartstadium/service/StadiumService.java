package com.bee.smartstadium.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Created by zaid on 10/01/2016
 * A bee-in-it java projects source.
 */
@Component
public class StadiumService {

    @Value("process.findpath.bin")
    private String findPathExec;

    @Value("process.findpath.cpbin")
    private String findPathCpExec;

}
