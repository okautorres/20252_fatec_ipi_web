package com.br.lojaquadros; 


public class LoginResponse {
    private int id;
    private String name;
    private String email;
    private String token; 

    public LoginResponse() {}
    public LoginResponse(int id, String name, String email, String token) {
        this.id = id; this.name = name; this.email = email; this.token = token;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    @Override
    public String toString() {
        return "LoginResponse{id=" + id + ", name=" + name + ", email=" + email + ", token=" + token + "}";
    }
}
