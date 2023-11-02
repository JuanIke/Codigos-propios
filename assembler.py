from iic2343 import Basys3
import sys

#variables no pueden tener nombres solo numericos

if len(sys.argv) != 2:
    print("Uso: python3 assembler.py <nombre_archivo>")
    sys.exit(1)

nombre_archivo = sys.argv[1] #obtiene el nombre del archivo
rom_programer = Basys3()

def quitar_elem_vacios(lista):
    nueva_lista = []
    for i in range(len(lista)):
        if lista[i] == "":
            continue   
        else:
            nueva_lista.append(lista[i])
    return nueva_lista

def adaptar_linea(linea, lugar): #data o code es el lugar
    #comentarios 
    
    delimitador = "//"
    if delimitador in linea:
        linea = linea.split(delimitador)[0]
        if linea == "":
            return ""
    elif linea == "":
        return ""

    if lugar == "data":
        linea = linea.split(" ")
        nueva_linea = []
        for i in range(len(linea)):
            if linea[i] == "":
                continue
            else:
                nueva_linea.append(linea[i])
        
        print(nueva_linea)
        if len(nueva_linea)==1:
            num = conv_decimal(nueva_linea[0])
            num = str(num)
            instruccion = num
            return instruccion
        num = conv_decimal(nueva_linea[1])
        num = str(num)
        nueva_linea = [nueva_linea[0], num]
        instruccion = nueva_linea[0]+" "+nueva_linea[1]
        print(instruccion)
        return instruccion
    
    elif lugar == "code":
        instruccion_pre = linea.split(" ")
        lista_instruccion = []
        
        for i in range(len(instruccion_pre)):
            if instruccion_pre[i] == "":
                continue
            else:
                lista_instruccion.append(instruccion_pre[i])

        print(lista_instruccion)
        operando = lista_instruccion[0]
        instruccion = operando + " "
        print("aki" , instruccion)
        for i in range(1, len(lista_instruccion)):
            print(lista_instruccion[i])
            if lista_instruccion[i].isalnum():
                if lista_instruccion[i][-1] in ["d", "b", "h"] and lista_instruccion[i][:-1].isnumeric():
                    lista_instruccion[i] = str(conv_decimal(lista_instruccion[i]))
            instruccion += lista_instruccion[i] 
    
        return instruccion

def conv_decimal(numero):
    if numero[-1] == "d":
        return numero[:-1]
    elif numero[-1] == "b":
        return int(numero[:-1], 2)
    elif numero[-1] == "h":
        return int(numero[:-1], 16)
    else:
        return numero
    
def es_numero(numero):

    if numero[-1] in ["d", "b", "h"] or numero[-1].isnumeric():
        return True
        

#retornara solo el opcode 
def instruccion_operandos(instruccion, dict_opcodes, VARIABLES, LABELS):
    nombres_var = []
    for i in range(len(VARIABLES)):
        nombres_var.append(VARIABLES[i][1])
    
    print("instruccion", instruccion)
    posicion_dir = 0
    posicion_lit = 0
    instruccion_lista = instruccion.split(" ") #["MOV","A,B"]
    
    instruccion_lista = quitar_elem_vacios(instruccion_lista)
    print("instruccion lista", instruccion_lista)
    if len(instruccion_lista) >= 2:
        if "," in instruccion_lista[1]:
            operandos = instruccion_lista[1].split(",") 
        else:
            operandos = [instruccion_lista[1]]
    jumps_call_lista = ["JMP", "JEQ", "JNE", "JGT", "JGE", "JLT", "JLE", "JCR", "CALL"]

    #si esque existe en el dic, opciones sin lit ni dir
    instruccion = instruccion.strip()  # Elimina espacios en blanco al principio y al final
    if instruccion in dict_opcodes:
        print("entro")
        lit = "0"
        while len(lit) < 16:
            lit = "0" + lit
        if instruccion in ["POP A", "POP B", "RET"]:
            opcode_1 = lit + dict_opcodes[instruccion]
            instruccion_2 = instruccion+"1"
            opcode_2 = lit + dict_opcodes[instruccion_2]
            print(opcode_1, opcode_2)
            return [opcode_1, opcode_2]
        else:
            opcode = lit + dict_opcodes[instruccion]
            print(opcode)
            return opcode
    #JUMPS INSTANCIAS
    elif instruccion_lista[0] in jumps_call_lista:
        label = operandos[0]
        for i in range(len(LABELS)):
            if label == LABELS[i][0]:
                dir_label = LABELS[i][1]
                while len(dir_label) < 16:
                    dir_label = "0" + dir_label
                opcode = dir_label + dict_opcodes[instruccion_lista[0]]
                print(opcode)
                return opcode
               
    else:
        
        for i in range(len(operandos)):
            #(DIR)
            print("operando rev:", operandos[i])
            if "(" in operandos[i]:
                if i == 0:
                    posicion_dir = 1
                elif i == 1:
                    posicion_dir = 2
                var = operandos[i].replace("(", "") #variable x_2 ejemplo
                var = var.replace(")", "")
                
                if var not in nombres_var: # MOV A, (3) == MOV A, (dir)
                    var = conv_decimal(var)
                    dir_var = format(int(var), "b")
                    while len(dir_var) < 16:
                        dir_var = "0" + dir_var
                for i in range(len(VARIABLES)):
                    
                    if var == VARIABLES[i][1]:
                        dir_var = VARIABLES[i][0] #sin los ceros
                        while len(dir_var) < 16:
                            dir_var = "0" + dir_var
                        
                    
            elif es_numero(operandos[i]) or operandos[i] in nombres_var :
                if es_numero(operandos[i]):
                    operandos[i]= conv_decimal(operandos[i])
                if i == 0:
                    posicion_lit = 1
                elif i == 1:
                    posicion_lit = 2
                if str(operandos[i]).isnumeric():
                    lit = format(int(operandos[i]), "b")
                    while len(lit) < 16:
                        lit = "0" + lit
                else:
                    for j in range(len(VARIABLES)):
                        if operandos[i] == VARIABLES[j][1]:
                            lit = VARIABLES[j][0]
                            while len(lit) < 16:
                                lit = "0" + lit
        

        print("posiciones lit, dir", posicion_lit, posicion_dir)
        if posicion_dir == 0:
            if len(operandos) > 1:
                if posicion_lit == 1:
                    operandos = ["Lit", operandos[1]]
                elif posicion_lit == 2:
                    operandos = [operandos[0], "Lit"]
                instruccion = dict_opcodes[instruccion_lista[0]+" "+operandos[0]+","+operandos[1]]
            else: 
                operandos = ["Lit"]
                instruccion = dict_opcodes[instruccion_lista[0] + " " + operandos[0]]
                
            opcode = lit + instruccion
            print(opcode)
            return opcode
        else:
            if len(operandos) > 1:
                if posicion_dir == 1:
                    operandos = ["(Dir)", operandos[1]]
                elif posicion_dir == 2:
                    operandos = [operandos[0], "(Dir)"]
                instruccion = dict_opcodes[instruccion_lista[0]+" "+operandos[0]+","+operandos[1]]
            else: 
                operandos = ["(Dir)"]
                instruccion = dict_opcodes[instruccion_lista[0] + " " + operandos[0]]
                
            opcode = dir_var + instruccion
            print(opcode)
            return opcode


def escribir_archivo(nombre_archivo, opcodes):
    with open(nombre_archivo, "w") as f:
        for i in range(len(opcodes)):
            f.write(opcodes[i][1] + "\n")



                        
                        



#opcodes de la tabla
opcode_ini = 1
lista_opcodes =  []
instrucciones = [["MOV", 12], ["ADD", 9 ], ["SUB", 9], ["AND", 9], ["OR", 9], ["XOR", 9 ], ["NOT", 4],["SHL", 4], ["SHR", 4], ["INC", 4], ["DEC", 1], ["CMP", 4],["JMP", 1],[ "JEQ", 1],["JNE",1], ["JGT", 1], ["JGE", 1], ["JLT", 1],["JLE", 1], ["JCR", 1], ["PUSH", 2], ["POP", 4], ["CALL", 1], ["RET", 2], ["NOP", 1]]


for i in range(len(instrucciones)):
    for j in range(instrucciones[i][1]):

        num_bin = format(opcode_ini,"b")
        while len(num_bin) < 20:
            num_bin = "0" + num_bin
        lista_opcodes.append([instrucciones[i][0], num_bin ])
        opcode_ini += 1

operandos_mov = [" A,B", " B,A", " A,Lit", " B,Lit", " A,(Dir)", " B,(Dir)", " (Dir),A", " (Dir),B", " A,(B)", " B,(B)", " (B),A", " (B),Lit"] 
operandos_var = [" A,B", " B,A", " A,Lit", " B,Lit", " A,(Dir)", " B,(Dir)", " (Dir)", " A,(B)", " B,(B)"] #ADD SUB AND OR XOR
operandos_nshf = [" A", " B,A", " (Dir),A", " (B),A"] #NOT SHL SHR 
operandos_inc = [" A", " B", " (Dir)", " (B)"] 
operandos_dec = [" A"]
operandos_cmp = [" A,B", " A,Lit", " A,(Dir)", " A,(B)"]

#JMP JEQ JNE solo uno
operandos_total = operandos_mov + operandos_var * 5 + operandos_nshf * 3 + operandos_inc + operandos_dec + operandos_cmp 

operandos_push = [" A", " B"]
operandos_pop = [" A", " A1", " B", " B1"]
operandos_ret = ["", "1"]

cont_push = 0
cont_pop = 0
cont_ret = 0
cont_operandos = 0 
for i in range(len(lista_opcodes)):
    if cont_operandos < len(operandos_total):
        lista_opcodes[i][0] += operandos_total[cont_operandos]
        cont_operandos += 1

    elif lista_opcodes[i][0] == "PUSH":
    
        lista_opcodes[i][0] += operandos_push[cont_push]
        cont_push += 1
    elif lista_opcodes[i][0] == "POP":
        lista_opcodes[i][0] += operandos_pop[cont_pop]
        cont_pop += 1
    elif lista_opcodes[i][0] == "RET":
        lista_opcodes[i][0] += operandos_ret[cont_ret]
        cont_ret += 1
    elif lista_opcodes[i][0]== "NOP":
        lista_opcodes[i][1] = "00000000000000000000"
   


print(lista_opcodes)
dict_opcodes = dict(lista_opcodes)


#Leer archivo de entrada

try:
    with open(nombre_archivo, "r") as f:
        lines = f.readlines()
        lines = [x.strip() for x in lines]


except FileNotFoundError:
    print("No se encontro el archivo")
except Exception as e:
    print("Se produjo un error al abrir el archivo ", str(e))

instrucciones = lines 
print(instrucciones)

#dir de la rom, lit + opcode 
OPCODES_FIN = []
# Dir de la ram, nombre_var, valor
VARIABLES = []
ROM = []
RAM = []


vars_program = False

dir_ram = 0 #se pasaran a bin
dir_rom = 0 #se pasaran a bin


#sacar DATA
for i in range(len(instrucciones)):
    print("instruccionendata:", instrucciones[i])
    if instrucciones[i] == "DATA:":
        vars_program = True
    elif "CODE" in instrucciones[i]:
        print("instruccion code", instrucciones[i])
        vars_program = False
    elif vars_program:
        instrucciones[i] = adaptar_linea(instrucciones[i], "data")
        print("instruccion en var: ",instrucciones[i])
        if instrucciones[i] == "":
            continue
        else:
            var = (instrucciones[i].split(" "))
            if len(var) == 1:
                var.insert(0,"")
            print("var:", var)
            var.insert(0,format(dir_ram, "b"))
            VARIABLES.append(var)
            dir_ram += 1

print("lista_var:", VARIABLES)


#instrucciones para guardar la data en la ram
#literales (16bits ) + opcode
for i in range(len(VARIABLES)):
    print("variable", VARIABLES[i])
    literal = format(int(VARIABLES[i][2]), "b")
    direc = VARIABLES[i][0]

    while len(literal)<16:
        literal = "0" + literal
    while len(direc)<16:
        direc = "0" + direc
    #instrucciones MOV A,Lit 
    print(literal + dict_opcodes["MOV A,Lit"])
    OPCODES_FIN.append([format(dir_rom, "b"),literal + dict_opcodes["MOV A,Lit"]])
    dir_rom += 1
    #instrucciones MOV (Dir),A 
    print(direc + dict_opcodes["MOV (Dir),A"])
    OPCODES_FIN.append([format(dir_rom, "b"),direc + dict_opcodes["MOV (Dir),A"]])
    dir_rom += 1

#sacar instrucciones LABEL, DIRECCION_ROM a dd salta
LABELS = []

codigo = False
#revisar los labels
dir_rom_labels = dir_rom

for i in range(len(instrucciones)):
    
    instrucciones[i] = adaptar_linea(instrucciones[i], "code")
    #print("INSTRUCCIONES EN LABEL: ", instrucciones[i])
    
    if "CODE" in instrucciones[i]:
        codigo = True
    print(codigo)
    if codigo:
        instrucciones[i] = adaptar_linea(instrucciones[i], "code")
        #print("instruccion en label",instrucciones[i])
        if instrucciones[i] == "CODE:":
            continue
        elif ":" in instrucciones[i]: #encuentra una label 
            #print("ENCONTRO UNA LABEL", instrucciones[i])
            label = instrucciones[i].replace(":", "")
            label = label[:-1]
            LABELS.append([label, format(dir_rom_labels, "b")]) #guarda la dirección del la siguiente instrucción (por eso no se agrega+=1)
        else:
            dir_rom_labels += 1
      
print("labels:", LABELS)
    

codigo = False
#ve todas las instrucciones de code hacia delante 
for i in range(len(instrucciones)):
    instrucciones[i] = adaptar_linea(instrucciones[i], "code")
    print("instruccion en code ",instrucciones[i])
    
    if "CODE" in instrucciones[i]:
        print("codigo")
        codigo = True
    if codigo:
        if ":" in instrucciones[i]: #encuentra una label 
            continue
        elif instrucciones[i] == "":
            continue
        else:
            result = instruccion_operandos(instrucciones[i], dict_opcodes, VARIABLES, LABELS)
            if type(result) is list:
                
                OPCODES_FIN.append([format(dir_rom, "b"),result[0]])
                dir_rom += 1
                OPCODES_FIN.append([format(dir_rom, "b"),result[1]])
                dir_rom += 1
            else:
                OPCODES_FIN.append([format(dir_rom, "b"),result])
                dir_rom += 1
                print("añadido")




    




escribir_archivo("result.txt", OPCODES_FIN)
