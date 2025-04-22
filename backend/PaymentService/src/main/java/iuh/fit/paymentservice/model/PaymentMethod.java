package iuh.fit.paymentservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "payment_methods")
@Data
public class PaymentMethod {
    @Id
    private String paymentMethodId;
    private String methodName;
    private String description;
}
