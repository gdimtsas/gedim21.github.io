---
title: "Hexagonal architecture with Spring Boot - Part 1"
date: 2021-03-15 20:35:12 +0200
tags: 
  - java
  - springboot
categories: 
  - programming
  - tutorial
published: false
---

## Why Hexagonal

Describe what is hexagonal:

Easier to adapt to changes.

Avoid entanglement between business logic and the interaction external entities.

## Architectural stereotypes

`Add a diagram`

### Domain

```java
package com.example.hexa.domain;


import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.UUID;

@Getter
@AllArgsConstructor
@EqualsAndHashCode(of = "id", callSuper = false)
public class Account {

    String id = UUID.randomUUID().toString();
    BigDecimal balance;
    Collection<Transaction> transactions = new ArrayList<>();

    public Account(BigDecimal balance) {
        this.balance = balance;
    }

    public void deposit(Account fromAccount, BigDecimal amount) {
        transactions.add(Transaction.of(fromAccount, this, amount));

        balance = balance.add(amount);
    }

    public void withdraw(Account toAccount, BigDecimal amount) {
        if (balance.compareTo(amount) < 0) {
            throw new RuntimeException("Balance is too low");
        }

        transactions.add(Transaction.of(this, toAccount, amount));
        balance = balance.subtract(amount);
    }
}
```

### Use Cases

Coordinate domain entities

### Ports

Used to interact with our application or interact with other applications.

### Adapters
