package com.br.lojaquadros;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    private String descr;
    private double value;
    private double promo;
    private int qt;
    private int contrast;
    private String keywords;
    
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getDesc() {
        return descr;
    }
    public void setDescr(String descr) {
        this.descr = descr;
    }
    public double getValue() {
        return value;
    }
    public void setValue(double value) {
        this.value = value;
    }
    public double getPromo() {
        return promo;
    }
    public void setPromo(double promo) {
        this.promo = promo;
    }
    public int getQt() {
        return qt;
    }
    public void setQt(int qt) {
        this.qt = qt;
    }
    public int getContrast() {
        return contrast;
    }
    public void setContrast(int contrast) {
        this.contrast = contrast;
    }
    public String getKeywords() {
        return keywords;
    }
    public void setKeywords(String keywords) {
        this.keywords = keywords;
    }


}
