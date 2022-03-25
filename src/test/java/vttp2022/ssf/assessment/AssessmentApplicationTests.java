package vttp2022.ssf.assessment;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import vttp2022.ssf.assessment.models.Quotation;
import vttp2022.ssf.assessment.services.QuotationService;

@SpringBootTest
class AssessmentApplicationTests {

	@Autowired
	private QuotationService quotationSvc;

	@Test
	void contextLoads() {
	}

	@Test
	void shouldFailWithInvalidList() {
		List<String> items = new ArrayList<>();
		items.add("durian");
		items.add("plum");
		items.add("pear");
		Optional<Quotation> opt = quotationSvc.getQuotations(items);
		Assertions.assertTrue(opt.isEmpty());
	}
}
