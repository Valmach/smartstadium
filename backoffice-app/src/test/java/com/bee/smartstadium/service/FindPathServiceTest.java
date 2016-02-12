package com.bee.smartstadium.service;

import com.bee.smartstadium.UiApplication;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;


import java.util.List;

import static org.junit.Assert.*;
/**
 * Created by zaid on 11/02/2016
 * A bee-in-it java projects source.
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(ServiceContextTest.class)
public class FindPathServiceTest {

    @Autowired
    private FindPathService service;

    @Value("${testdata.findpath.graph.ok}")
    private String successFile;

    @Value("${testdata.findpath.graph.ko}")
    private String failureFile;

    @Test
    public void testHelp() throws Exception {
       String result = service.help();
       assertNotNull(result);
       System.out.print(result);
    }
    @Test
    public void testStart() throws Exception {
        service.start();
        assertTrue(service.started());
        //assertNotEquals(service.statut(), "OK");

        service.exit();
        assertFalse(service.started());
    }

    @Test
    public void testLoad() throws Exception {
        service.start();
        //assertNotEquals(service.statut(), "OK");

        assertEquals( service.load(failureFile), "NOK");
        assertNotEquals(service.statut(), "OK");

        assertEquals( service.load(successFile), "OK");
        service.exit();
        assertFalse(service.started());
    }

    @Test
    public void testFind() throws Exception {
        service.start();
        assertTrue(service.started());
        assertEquals( service.load(successFile), "OK");
        List<String> find =service.find("1","7");
        assertFalse( find.isEmpty());
        assertEquals("First node equals 1 ? ", find.get(0), "1");
        assertEquals("Last node equals 7 ? ", find.get(find.size()-1), "7");

        service.exit();
        assertFalse(service.started());
    }


    @Test
    public void testFindEmpty() throws Exception {
        service.start();
        assertTrue(service.started());
        assertEquals( service.load(successFile), "OK");
        //FIXME : Test ko
        List<String> find =service.find("fake","fake");
        assertTrue(find.isEmpty());
        service.exit();
        assertFalse(service.started());
    }

}
