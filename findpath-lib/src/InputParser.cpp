#include "InputParser.hpp"

InputParser::InputParser()
{
    m_interrupt_ptr = NULL;
    m_graph_ptr = NULL;
}

InputParser::InputParser( bool * interrupt_ptr , MonumentGraph * graph_ptr )
{
    m_interrupt_ptr = interrupt_ptr;
    m_graph_ptr = graph_ptr;
}

InputParser::~InputParser()
{
}

void InputParser::splitString( std::vector<std::string> & splitStringVector, const std::string & strToSplit, const char & sep )
{
    // split de la chaine de caractère
    for(size_t p = 0, q = 0; p != strToSplit.npos; p = q)
    {
        splitStringVector.push_back( strToSplit.substr( p+(p!=0) , (q=strToSplit.find(sep, p+1))-p-(p!=0) ) );
    }
}

void InputParser::parse(std::string & inputString)
{


    // split de la chaine de caractère
    char sep = '=';
    std::vector <std::string> splitStrings;
    splitString(splitStrings, inputString, sep);


    // switch case avec string n'existe pas en C/C++ .. :-|
    if ( splitStrings.front()  == "exit")
    {
        (*m_interrupt_ptr) = true;
    }
    else if( splitStrings.front()  == "statut")
    {
        m_graph_ptr->printGraph();
    }

    else if( splitStrings.front()  == "load")
    {
        std::string filename = splitStrings.back();
        m_graph_ptr->initGraph(filename);
    }
    else if( splitStrings.front()  == "check")
    {
        std::cout << "check" << std::endl;
    }
    else if( splitStrings.front()  =="find")
    {
        // récupération du contenu entre parenthèse
        std::string verticeString = splitStrings.back().substr (splitStrings.back().find_first_of('(') +1 , splitStrings.back().find_last_of(')')-1 );
        std::vector <std::string> verticeIDs;
        // split du contenu avec le séparateur ","
        splitString(verticeIDs, verticeString, ',');
        //
        m_graph_ptr->printShortestPath( std::stoi(verticeIDs.front()) , std::stoi(verticeIDs.back()) );

    }
    else
    {
    }

}
