#ifndef INPUTPARSER_H
#define INPUTPARSER_H

#include <iostream>
#include <string>
#include <vector>

#include "MonumentGraph.hpp"

class InputParser
{
private:
    bool * m_interrupt_ptr;   // flag indiquant la demande d'interruption
    MonumentGraph * m_graph_ptr;  // pointeur vers le graphe
    void splitString( std::vector<std::string> & splitStringVector , const std::string & strToSplit, const char & sep );

public:
    /*
        constructeur et destructeur
    */
    InputParser();
    InputParser( bool * interrupt_ptr , MonumentGraph * graph_ptr );
    ~InputParser();

    // interpretation de la chaîne de caractère entrée
    void parse( std::string & inputStr );

};

#endif // INPUTPARSER_H
