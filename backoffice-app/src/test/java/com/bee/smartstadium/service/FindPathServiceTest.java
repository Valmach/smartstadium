package com.bee.smartstadium.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


import static org.junit.Assert.*;
/**
 * Created by zaid on 11/02/2016
 * A bee-in-it java projects source.
 */
@RunWith(SpringJUnit4ClassRunner.class)
public class FindPathServiceTest {

    @Autowired
    private FindPathService service;

    @Test
    public void testStart() throws Exception {
        service.start();
        System.out.println(service.statut());
    }
}
