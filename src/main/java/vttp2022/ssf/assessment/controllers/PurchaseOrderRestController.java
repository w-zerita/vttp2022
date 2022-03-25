package vttp2022.ssf.assessment.controllers;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonReader;
import vttp2022.ssf.assessment.models.Quotation;
import vttp2022.ssf.assessment.services.QuotationService;

@RestController
@RequestMapping(path="/api/po")
public class PurchaseOrderRestController {

    @Autowired
    private QuotationService quotationSvc;
    
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> postPO(@RequestBody String payload) {
        System.out.printf(">>> payload %s\n", payload);

        List<String> items = new ArrayList<>();
        JsonArray lineItems = null;
        String name = null;

        try (InputStream is = new ByteArrayInputStream(payload.getBytes())) {
            JsonReader r = Json.createReader(is);
            JsonObject o = r.readObject();
            lineItems = o.getJsonArray("lineItems");
            name = o.getString("name");

            for (int i = 0; i < lineItems.size(); i++) {
                JsonObject obj = lineItems.getJsonObject(i);
                String item = obj.getString("item");
                items.add(item);
            }

            System.out.printf(">>> Items: %s\n", items);

        } catch (IOException e) {
            e.printStackTrace();
        }

        Optional<Quotation> opt = quotationSvc.getQuotations(items);
        Quotation q = opt.get();

        if (opt.isEmpty()) {
            JsonObject empty = Json.createObjectBuilder()
                .build();
            return ResponseEntity
                .status(404)
                .body(empty.toString());
        }

        Float totalCost = 0f;

        for (int i = 0; i < lineItems.size(); i++) {
            JsonObject itemObj = lineItems.getJsonObject(i);
            String qmapkey = itemObj.getString("item");
            Float unitPrice = q.getQuotations().get(qmapkey);
            Integer quantity = itemObj.getInt("quantity");
            totalCost += quantity * unitPrice;
            System.out.printf(">>>> Total Cost: %s\n", totalCost);
        }

        JsonObject invoice = Json.createObjectBuilder()
            .add("invoiceId", q.getQuoteId())
            .add("name", name)
            .add("total", totalCost)
            .build();

        System.out.printf(">>>> Invoice: %s\n", invoice);
        
        return ResponseEntity
            .ok(invoice.toString());
    }
}
