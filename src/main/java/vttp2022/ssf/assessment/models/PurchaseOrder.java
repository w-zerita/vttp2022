package vttp2022.ssf.assessment.models;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;

public class PurchaseOrder {

    private Integer navigationId;
    private String name;
    private String address;
    private String email;
    private List<String> items;

    public Integer getNavigationId() {
        return navigationId;
    }
    public void setNavigationId(Integer navigationId) {
        this.navigationId = navigationId;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getItems() {
        return items;
    }
    public void setItems(List<String> items) {
        this.items = items;
    }

    public void addItem(String item) {
        this.items.add(item);
    }

    @Override
    public String toString() {
        return "PurchaseOrder [address=" + address + ", email=" + email + ", items=" + items + ", name=" + name
                + ", navigationId=" + navigationId + "]";
    }

    public static PurchaseOrder create(String json) throws IOException {
        PurchaseOrder po = new PurchaseOrder();
        InputStream is = new ByteArrayInputStream(json.getBytes());
        JsonReader r = Json.createReader(is);
        JsonObject o = r.readObject();
        JsonArray a = o.getJsonArray("lineItems");

        po.setNavigationId(o.getInt("navigationId"));
        po.setName(o.getString("name"));
        po.setAddress(o.getString("address"));
        po.setEmail(o.getString("email"));
        
        List<String> l = new ArrayList<>();
        for (int i = 0; i < a.size(); i++) {
            o = a.getJsonObject(i);
            String item = o.getString("item");
            l.add(item);
        }
        po.setItems(l);

        System.out.printf(">>> Purchase Order Items: s%\n", po.getItems());
        return po;
    }
    
    
}
