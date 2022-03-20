from prime_list import primes
import random
from used_numbers import past_primes



daily_prime = primes[(random.randint(0, 8363))]
while daily_prime in past_primes:
    daily_prime = primes[(random.randint(0, 8363))]

past_primes.append(daily_prime)

f = open("used_numbers.py", "w")
f.write("past_primes = ")
f.write(str(past_primes))
f.close

f = open("daily_prime.js", "w")
f.write("export const daily_prime = ")
f.write(str(daily_prime))
f.close()

