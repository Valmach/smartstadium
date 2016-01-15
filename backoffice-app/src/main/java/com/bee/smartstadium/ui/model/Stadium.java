package com.bee.smartstadium.ui.model;

import java.util.*;

/**
 * Created by zaid on 10/01/2016
 * A bee-in-it java projects source.
 */
public class Stadium {

    private String uid;

    private String fileName;

    private int gridRow = 7;

    private int gridCol = 6;

    private int gridWidth = 400;

    private int gridHeight = 200;


    private Map<String, Integer> nodes = new HashMap<>();

    private List<String> arcs = new ArrayList<>();

    // Coordonnées des champs désactivés :
    // row index, disables cols
    private List<String> disabled = new ArrayList<>();

    public Map<String, Integer> getNodes() {
        return nodes;
    }

    public void setNodes(Map<String, Integer> nodes) {
        this.nodes = nodes;
    }

    public List<String> getArcs() {
        return arcs;
    }

    public void setArcs(List<String> arcs) {
        this.arcs = arcs;
    }

    public List<String> getDisabled() {
        return disabled;
    }

    public void setDisabled(List<String> disabled) {
        this.disabled = disabled;
    }

    public int getGridRow() {
        return gridRow;
    }

    public void setGridRow(int gridRow) {
        this.gridRow = gridRow;
    }

    public int getGridCol() {
        return gridCol;
    }

    public void setGridCol(int gridCol) {
        this.gridCol = gridCol;
    }

    public int getGridWidth() {
        return gridWidth;
    }

    public void setGridWidth(int gridWidth) {
        this.gridWidth = gridWidth;
    }

    public int getGridHeight() {
        return gridHeight;
    }

    public void setGridHeight(int gridHeight) {
        this.gridHeight = gridHeight;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * Disable access path from a grid
     * @param row Row index to disable
     * @param cols List of cols to disable
     */
    public void disableGridPositions(int row, int... cols){
        for(int col: cols){
            disabled.add(row+","+col);
        }
    }
    public boolean isEnabled(int row, int col){
        return !disabled.contains(row+","+col);
    }

    public void loadNodes(){
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

    public int getLabel(int row, int col) {
        if(isEnabled(row, col) && nodes.containsKey(row+","+col)){
            return nodes.get(row+","+col);
        }else{
            return -1;
        }
    }

    public void loadEdge(){
        arcs.clear();
        //Put all available nodes
        for(int row=1;row<=gridRow;row++){
            for(int col=1;col<=gridCol;col++){

                Integer nodeFrom = getLabel(row, col);
                if(nodeFrom > -1){
                    int[] borderRows = new int[]{
                            (row - 1), (row), (row +1)
                    };
                    int[] borderCols = new int[]{
                            (col - 1), (col), (col +1)
                    };
                    for(int currentRow : borderRows){
                        for(int currentCol : borderCols){

                            if(!(currentRow == row && currentCol == col) && getLabel(currentRow, currentCol) > -1){
                                Integer nodeTo = getLabel(currentRow, currentCol);
                                arcs.add(nodeFrom+"\t"+getLabel(currentRow, currentCol));
                            }
                        }
                    }
                }
            }
        }
    }

    public String buildConfig(){
        StringBuilder nodeConf = new StringBuilder();
        nodeConf.append("@nodes\nlabel\n");
        List<Integer> nds = new ArrayList<>(nodes.values());
        Collections.sort(nds);
        for(Integer next : nds){
            nodeConf.append(next).append("\n");
        }
        nodeConf.append("@arcs\n\t\t-\n");
        for(String next : arcs){
            nodeConf.append(next).append("\n");
        }
        return nodeConf.toString();
    }

}
