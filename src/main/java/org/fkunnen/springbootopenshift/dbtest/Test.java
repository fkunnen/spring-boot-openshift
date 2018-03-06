package org.fkunnen.springbootopenshift.dbtest;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Test {

    @Id
    private String name;

    public Test() {
    }

    public Test(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
