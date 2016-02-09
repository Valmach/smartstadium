package ch.bee.test;

import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.FileSystemUtils;

import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

/**
 * Created by BZ02973 on 07.01.2016.
 */
public class GenerateFileTest {

    private static Map<String, Integer> nodes = new HashMap<>();
    private static List<String> arcs = new ArrayList<>();

    // Coordonnées des champs désactivés :
    // row index, disables cols
    private static List<String> disabled = new ArrayList<>();

    private static int gridRow = 100;
    private static int gridCol = 100;


    private static void disableEnabled(int row, int... cols){
        for(int col: cols){
            disabled.add(row+","+col);
        }
    }
    private static boolean isEnabled(int row, int col){
        return !disabled.contains(row+","+col);
    }

    private static void loadNodes(){
        nodes.clear();
        int nodeLabel = 1;
        //Put all available nodes
        for(int row=1;row<=gridRow;row++){
            for(int col=1;col<=gridCol;col++){
                if(isEnabled(row, col)) {
                    nodes.put(row+","+col, nodeLabel);
                }
                nodeLabel++;
            }
        }
    }

    private static int getLabel(int row, int col) {
        if(isEnabled(row, col) && nodes.containsKey(row+","+col)){
            return nodes.get(row+","+col);
        }else{
            return -1;
        }
    }
    private static void loadEdge(){
        arcs.clear();
        //Put all available nodes
        for(int row=1;row<=gridRow;row++){
            for(int col=1;col<=gridCol;col++){

                Integer nodeFrom = getLabel(row, col);
                if(nodeFrom > -1){
                    int[] r = new int[]{
                            (row - 1), (row), (row +1)
                    };
                    int[] c = new int[]{
                            (col - 1), (col), (col +1)
                    };
                    for(int nextR : r){
                        for(int nextC : c){
                            if(!(nextR == row && nextC == col) && getLabel(nextR, nextC) > -1){
                                Integer nodeTo = getLabel(nextR, nextC);
                                arcs.add(nodeFrom+"\t"+getLabel(nextR, nextC));
                            }
                        }
                    }
                }
            }
        }
    }

    public static double randDouble(double min, double max) {


        // nextInt is normally exclusive of the top value,
        // so add 1 to make it inclusive
        double randomNum = new Random().nextDouble();
        return  min + (max - min) * randomNum;
    }

    public static int randInt(int min, int max) {


        // nextInt is normally exclusive of the top value,
        // so add 1 to make it inclusive
        int randomNum = new Random().nextInt((max - min) + 1) + min;

        return randomNum;
    }

    public static void main(String[] args){
        /*
        disabled.put(3, Arrays.asList(3, 4));
        disabled.put(4, Arrays.asList(3, 4));
        disabled.put(5, Arrays.asList(3, 4));

        disableEnabled(3, 3, 4);
        disableEnabled(4, 3, 4);
        disableEnabled(5, 3, 4);
        */
        loadNodes();
        loadEdge();

        StringBuilder nodeConf = new StringBuilder();
        nodeConf.append("@nodes").append("\n");
        nodeConf.append("label").append("\n");
        List<Integer> nds = new ArrayList<>(nodes.values());
        Collections.sort(nds);
        for(Integer next : nds){
            nodeConf.append(next).append("\n");
        }
        nodeConf.append("@arcs").append("\n");
        nodeConf.append("\t\tlabel\tdistance").append("\n");
        int nextLabel = 0;
        for(String next : arcs){
            //nodeConf.append(next).append("\t").append(nextLabel).append("\t").append(randInt(1, 100)).append("\n");
            String split = ""+ randDouble(1, 100);
            if(split.length() > 6){
                split = split.substring(0,6);
            }
            nodeConf.append(next).append("\t").append(nextLabel).append("\t").append(split).append("\n");
            nextLabel++;
        }
        System.out.println(nodeConf);
        try {
            Files.write(Paths.get("./testDoubles3.txt"), nodeConf.toString().getBytes());
            //FileCopyUtils.copy(nodeConf.toString(), new FileWriter("C:/tmp/config.lgf"));
        }catch (Exception e) {

        }
        /*
        @nodes
        label
         */
    }
}
