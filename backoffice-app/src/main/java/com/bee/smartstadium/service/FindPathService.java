package com.bee.smartstadium.service;

import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.OptionBuilder;
import org.apache.commons.cli.Options;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;


/**
 * Created by zaid on 11/02/2016
 * A bee-in-it java projects source.
 */
@Component
public class FindPathService  {

    private Logger logger = LoggerFactory.getLogger(FindPathService.class);

    @Value("${process.findpath.name}")
    private String name;

    @Value("${process.findpath.bin}")
    private String command;

    @Value("${process.findpath.cpbin}")
    private String findPathCpExec;

    @Value("${process.findpath.defaultfile}")
    private String defaultGraph;

    private StringBuilder responseLine = new StringBuilder();

    private boolean released = false;

    private static ReadingThread out;

    private static ReadingThread err;

    private static BufferedWriter cmd;

    private static Process child;

    private static Thread processThread;

    public FindPathService() {
    }

    public String help(){
        String result = "";
        try {
            Options options = new Options();
            options.addOption("exit","met fin au programme (commande valide sans condition)");
            options.addOption("load","load=/tmp/fichier.lgf : Valide un fichier décrit selon la REGLE1 : Validation du fichier de configuration d'une matrice. Si le fichier est bien chargé le programme écrit dans System.out 'OK' sinon 'KO'");

            HelpFormatter formatter = new HelpFormatter();
            StringWriter writer = new StringWriter();
            PrintWriter pw = new PrintWriter(writer);
            formatter.printUsage(pw, 40,name, options);
            result = writer.toString();
            pw.close();
            writer.flush();
            writer.close();
        }catch (Exception e){
            result = e.getMessage();
        }
        return result;
    }

    public void start() {
        if(!started()) {

            try {
                logger.info("Running process {}", command);

                FindPathService.child = Runtime.getRuntime().exec(command);
                FindPathService.out = new ReadingThread(this, child.getInputStream(), "out");
                FindPathService.err = new ReadingThread(this, child.getErrorStream(), "err");
                FindPathService.out.start();
                FindPathService.err.start();
                FindPathService.cmd = new BufferedWriter(new OutputStreamWriter(child.getOutputStream()));

                logger.info("Loading the default graph {}", defaultGraph);
                defaultLoad();

            }catch (Exception e){
                if( FindPathService.child !=null){
                    FindPathService.child.destroy();
                    FindPathService.child =null;
                }
            }
        }
    }

    public boolean started() {
        return (child != null);
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
        FindPathService.child =null;

    }

    /**
     * Loading the default graph as a check of the system
     * @return
     * @throws Exception
     */
    private String defaultLoad() throws Exception{
        cmd("load="+defaultGraph);
        return responseLine.toString();
    }

    public String load(String file) throws Exception{
        cmd("load="+file);
        return responseLine.toString();
    }

    /*

     */
    public List<String> find(String from, String to) {
        String response = "";
        try {
            cmd("find="+from+","+to);
            response = responseLine.reverse().toString();
        }catch (Exception e){
            logger.error("Return will be empty : Find path from {} to {} in error:{} ",from,to,e.getMessage());
        }

        if(response.isEmpty()){
            //FIXME : La libraire retourne une valeur illisible dans le cas ou le chemin n'existe pas
            //      noisrevnoc on :iots :tnemugra_dilavni::dts epyt fo noitpecxe thguacnu htiw gnitanimret :bilyd.iba++cbil
            return Collections.emptyList();
        }else{
            return Arrays.asList(response.split("-<"));
        }
    }

    public void cmd(String cmd) throws Exception{
        if(started()) {
            synchronized (this) {
                released = false;
                responseLine = new StringBuilder();
                FindPathService.cmd.write(cmd);
                FindPathService.cmd.newLine();
                FindPathService.cmd.flush();
                while (!released) {
                    Thread.sleep(100);
                }
            }
        }else{
            responseLine = new StringBuilder();
            released = true;
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
