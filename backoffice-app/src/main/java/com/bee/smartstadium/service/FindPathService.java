package com.bee.smartstadium.service;

import org.apache.catalina.Engine;
import org.apache.commons.daemon.Daemon;
import org.apache.commons.daemon.DaemonContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;


/**
 * Created by zaid on 11/02/2016
 * A bee-in-it java projects source.
 */
@Component
public class FindPathService  {

    private Logger logger = LoggerFactory.getLogger(FindPathService.class);

    @Value("process.findpath.bin")
    private String findPathExec;

    @Value("process.findpath.cpbin")
    private String findPathCpExec;

    private String command = "/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/bee-smart-stadium-os";

    private StringBuilder responseLine = new StringBuilder();

    private boolean released = false;

    private static ReadingThread out;

    private static ReadingThread err;

    private static BufferedWriter cmd;

    private static Process child;

    public FindPathService() {
        /*
        BufferedWriter out = new BufferedWriter(new OutputStreamWriter(child.getOutputStream()));
        out.write("statut");
        out.newLine();
        out.flush();
        out.write("statut");
        out.newLine();
        out.flush();
        System.out.println("exit : met fin au programme (commande valide sans condition).");
        System.out.println("load=<fichier> : le programme lit un fichier de configuration (décrit dans la REGLE1 : Validation du fichier de configuration d'une matrice). Si le fichier est bien chargé le programme écrit dans System.out \"OK\", sinon il écrit \"KO\". Quand le fichier est lu et qu'il est valide alors le programme garde en mémoire les données pour eviter de les recharger pour les calculs de chemin. La commande peut être exécutée plusieurs fois. La mise à jour du cache ne se fait que si le fichier lu est valide.");
        System.out.println("check=<fichier> : Valide un fichier décrit selon la REGLE1 : Validation du fichier de configuration d'une matrice. Si le fichier est bien chargé le programme écrit dans System.out \"OK\", sinon il écrit \"KO\".");
        System.out.println("statut : Affiche les informations du cache chargé en mémoire. Si le fichier de matrice n'est pas chargé, le statut affiche \"KO\".");
        System.out.println("find=(<x,y>);(<a,b>) : exemple : find=(1,1);(7,12) : Retourne le chemin le plus cours entre deux points avec <x,y> : coordonnées de départ et <a,b> : coordonnées d'arrivée.");
        System.out.println("------------------");
        System.out.println("statut");
        System.out.println("load=/Users/zaid/IdeaProjects/smartstadium/backoffice-app/src/main/resources/process/test.lgf");

        */
    }

    public void start()  throws IOException {
        if(!started()) {
            FindPathService.child = Runtime.getRuntime().exec(command);
            FindPathService.out = new ReadingThread(this, child.getInputStream(), "out");
            FindPathService.err = new ReadingThread(this, child.getErrorStream(), "err");
            FindPathService.out.start();
            FindPathService.err.start();

            FindPathService.cmd = new BufferedWriter(new OutputStreamWriter(child.getOutputStream()));
        }
    }

    public boolean started() {
        return (child != null && child.isAlive());
    }

    public String statut() throws Exception{
        cmd("statut");
        return responseLine.toString();
    }

    public void exit() throws Exception{
        responseLine = new StringBuilder();
        FindPathService.cmd.write("exit");
        FindPathService.cmd.newLine();
        FindPathService.cmd.flush();
        FindPathService.err.closeStream();
        FindPathService.out.closeStream();
        cmd.close();
        FindPathService.child.destroy();


    }
    public String load(String file) throws Exception{
        cmd("load="+file);
        return responseLine.toString();
    }

    public String find(String from, String to) throws Exception{
        cmd("find="+from+","+to);
        return responseLine.reverse().toString().replaceAll("<",">");
    }

    public void cmd(String cmd) throws Exception{

        synchronized (this){
            released = false;
            responseLine = new StringBuilder();
            FindPathService.cmd.write(cmd);
            FindPathService.cmd.newLine();
            FindPathService.cmd.flush();
            while (!released){
                Thread.sleep(100);
            }
        }

    }


    public String response() throws Exception{

        return responseLine.toString();
    }

    public void push(String line){
        responseLine.append(line);
    }

    public void release(){
        released = true;
    }

    private class ReadingThread extends Thread {
        private final InputStream inputStream;
        private final String name;
        private FindPathService parent;
        private BufferedReader in = null;
        public ReadingThread(FindPathService parent, InputStream inputStream, String name) {
            this.parent = parent;
            this.inputStream = inputStream;
            this.name = name;
        }

        public void closeStream() throws IOException {
            if(in !=null){
                in.close();
                this.inputStream.close();
            }
        }

        public void run() {
            try {
                in = new BufferedReader(
                        new InputStreamReader(inputStream));
                StringBuilder b = new StringBuilder();
                for (String s = in.readLine(); s != null; s = in.readLine()) {
                    parent.push(s);
                    parent.release();
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }



}
