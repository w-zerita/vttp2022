package vttp2022.ssf.assessment.services;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonArrayBuilder;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp2022.ssf.assessment.models.Quotation;

@Service
public class QuotationService {

    private static final String URL = "https://quotation.chuklee.com/quotation";

    public Optional<Quotation> getQuotations(List<String> items) {

        System.out.println(">>> QuotationService -> getQuotations");

        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();

        for (String i: items) {
            arrBuilder.add(i);
        }

        JsonArray itemArr = arrBuilder.build();

        System.out.printf(">>> itemArr: %s\n", itemArr.toString());

        RequestEntity<String> req = RequestEntity
            .post(URL)
            .contentType(MediaType.APPLICATION_JSON)
            .accept(MediaType.APPLICATION_JSON)
            .body(itemArr.toString(), String.class);

        System.out.printf(">>> req: %s\n", req.toString());

        RestTemplate template = new RestTemplate();

        try {
            ResponseEntity<String> resp = template.exchange(req, String.class);
            System.out.println(">>> resp: " + resp.toString());

            if (resp.getStatusCodeValue() >= 400)
                return Optional.empty();
                
            Quotation q = createQuotation(resp.getBody());
            System.out.printf(">>>> Quotation Service - resp: %s\n", resp.getBody());
            System.out.printf(">>>> q: %s\n", q.getQuotations());
            return Optional.of(q);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return Optional.empty();
    }

    public static Quotation createQuotation(String json) throws IOException {

        Quotation q = new Quotation();

        InputStream is = new ByteArrayInputStream(json.getBytes());
        JsonReader r = Json.createReader(is);
        JsonObject o = r.readObject();

        q.setQuoteId(o.getString("quoteId"));
    
        JsonArray qArr = o.getJsonArray("quotations");
        Map<String, Float> qmap = new HashMap<String, Float>();

        for (int i = 0; i < qArr.size(); i++) {
            JsonObject qObj = qArr.getJsonObject(i);
            Float unitPrice = Float.valueOf(String.valueOf(qObj.getJsonNumber("unitPrice")));
            String item = qObj.getString("item");
            qmap.put(item, unitPrice);
        }
        q.setQuotations(qmap);

        return q;
    }
    
}
