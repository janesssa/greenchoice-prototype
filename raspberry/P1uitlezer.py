#
# DSMR P1 uitlezer
# (c) 10-2012 - GJ - gratis te kopieren en te plakken

versie = "1.0"
import sys
import serial
import os
import time 
import mariadb
import sys
from time import sleep
from datetime import datetime
from csv import reader

################
#Error display #
################
def show_error():
    ft = sys.exc_info()[0]
    fv = sys.exc_info()[1]
    print("Fout type: %s" % ft )
    print("Fout waarde: %s" % fv )
    return


################################################################################################################################################
#Main program
################################################################################################################################################
print ("DSMR P1 uitlezer",  versie)
print ("Control-C om te stoppen")

try:
    conn = mariadb.connect(
        user="root",
        password="root",
        host="localhost",
        port=3306,
        database="P1data"
    )
except mariadb.Error as e:
    print(e)
    print(f"Error connecting to MariaDB Platform: {e}")
    sys.exit(1)

cur = conn.cursor()

#Set COM port config
ser = serial.Serial()
ser.baudrate = 9600
ser.bytesize=serial.SEVENBITS
ser.parity=serial.PARITY_EVEN
ser.stopbits=serial.STOPBITS_ONE
ser.xonxoff=0
ser.rtscts=0
ser.timeout=20
ser.port="/dev/ttyUSB0"

#Open COM port
try:
    ser.open()
except:
    sys.exit ("Fout bij het openen van %s. Programma afgebroken."  % ser.name)      


#Initialize
stack=[]

# file = open("./data_log.csv", "w+")
# i=0
# if os.stat("./data_log.csv").st_size == 0:
#         file.write("Time,Afgenomen,Teruggeleverd\n")

exectued_once = False


while stack == [] or len(stack) != 18:
    print('uitlezen')
    
                cur.execute("SELECT * FROM Live")
                res = cur.fetchall()
                print(res)
    p1_line=''
#Read 1 line
    try:
        p1_raw = ser.readline()
        if exectued_once == False:
            stamp = datetime.now()
            exectued_once = True
            print(stamp)
    except:
        sys.exit ("Seriele poort %s kan niet gelezen worden. Programma afgebroken." % ser.name )      
    p1_str=str(p1_raw)
    #p1_str=str(p1_raw, "utf-8")
    p1_line=p1_str.strip()
    stack.append(p1_line)
    if len(stack) >= 18:
        print('startover')
        time.sleep(10)
# else:
#     stack.insert(0, 'timestamp:{}'.format(stamp))  
#     p1_teller = 0
#     print('new telegram', stack, p1_teller)

        print('hier ben ik ook')

#Initialize
# stack_teller is mijn tellertje voor de 20 weer door te lopen. Waarschijnlijk mag ik die p1_teller ook gebruiken
        stack_teller=0
        meter=0
        seconds= time.time()
        saveTime = 900
        now= None
        taken= None
        given = None
        print('hier ben ik dan', len(stack) != 0, len(stack))

        # while time.time() >= seconds + saveTime or stack != []:
        while len(stack) != 0:
            print('search', stack_teller)
            print('search', stack[stack_teller])
            if stack[stack_teller][:9] == "timestamp":
                now = stack[stack_teller][10:36]
            elif stack[stack_teller][2:11] == "1-0:1.7.0":
                taken = stack[stack_teller][12:19]
            elif stack[stack_teller][2:11] == "1-0:2.7.0":
                given = stack[stack_teller][12:19]
            if now and taken and given:
                print(now, taken, given)
                # with open('data_log.csv', 'r') as read_obj:
                #     data = []
                #     row_index = 0
                #     csv = reader(read_obj)
                #     for row in csv:
                #         if row:
                #             row_index += 1
                #             columns = [str(row_index), row[0], row[1], row[2]]
                #             data.append(columns)

                #     print(data[-1], data, columns, row_index)

                print('writing file')
                try:
                    cur.execute(
                        "INSERT INTO Live (time, taken, given) VALUES (?, ?, ?)", 
                        (now, taken, given))
                    
                except mariadb.Error as e:
                    print(e)
                # file.write(str(now)+","+str(taken)+","+str(given)+"\n")
                # file.flush()
                now = None
                taken = None
                given = None
                exectued_once = False
                stack = []
                print('new telegram via DB')
                time.sleep(10)

            if stack_teller < 17:
                stack_teller = stack_teller +1
            else:
                stack_teller = 0
                exectued_once = False
                print('new telegram via stack_teller')
                time.sleep(10)


if time.time() == seconds + saveTime:
    file.close()
    print (stack, "\n")
    print (file.read())

    
#Close port and show status
try:
    ser.close()
    conn.commit() 
    print(f"Last Inserted ID: {cur.lastrowid}")
    print(p1_teller < 18 or stack == [])
    print(time.time() >= seconds + saveTime or stack != [])
    conn.close()
except:
    sys.exit ("Oops %s. Programma afgebroken." % ser.name )      
